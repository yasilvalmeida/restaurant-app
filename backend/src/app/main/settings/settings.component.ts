import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { SettingsService } from 'app/main/service/settings.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SettingsComponent implements OnInit, OnDestroy {

  form: FormGroup;
    _errorMessage: string = "";
    // Horizontal Stepper
    _generalInformationForm: FormGroup;
    _deviceInformationForm: FormGroup;
    @ViewChild('stepper', {static: true})
    public stepper: MatStepper;
    public _currentStep: number;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _settingsService: SettingsService,
        private _fuseProgressBarService: FuseProgressBarService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // General Information form steps
        this._generalInformationForm = this._formBuilder.group({
            generalName       : ['', Validators.required],
            title             : ['', Validators.required],
            version           : ['', Validators.required],
            generalDescription: ['', Validators.required]
        });
        // Device Information form steps
        this._deviceInformationForm = this._formBuilder.group({
            deviceName        : ['', Validators.required],
            deviceDescription : ['', Validators.required]
        });
        // Load settings
        this.load();
    }

    // Load from API
  load(): void {
    // Show the progress bar
    this._fuseProgressBarService.show();
    this._settingsService.fetch()
    .subscribe
    (
      data => {
        // Hide the progress bar
        this._fuseProgressBarService.hide();
        // Load General Information
        this._generalInformationForm.setValue({
          generalName       : data.setting.general.name,
          title             : data.setting.general.title,
          version           : data.setting.general.version,
          generalDescription: data.setting.general.description
        });
        // Load Device Information
        this._deviceInformationForm.setValue({
          deviceName        : data.setting.device.name,
          deviceDescription : data.setting.device.description
        });
      },
      error => {
        console.log(error);
        // Hide the progress bar
        this._fuseProgressBarService.hide();
      }
    );
  }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update Settings Information
     */
    update(): void
    {
        let data = {
            general: {
                name       : this._generalInformationForm.get("generalName").value,
                title      : this._generalInformationForm.get("title").value,
                version    : this._generalInformationForm.get("version").value,
                description: this._generalInformationForm.get("generalDescription").value,
            },
            device: {
                name       : this._deviceInformationForm.get("deviceName").value,
                description: this._deviceInformationForm.get("deviceDescription").value,
            }
        }
        // Show the progress bar
        this._fuseProgressBarService.show();
        this._settingsService.update(data)
        .subscribe
        (
        data => {
            // Hide the progress bar
            this._fuseProgressBarService.hide();
            if (data.ok) {
                this.setStepper(0);
            }
        },
        error => {
            console.log(error);
            // Hide the progress bar
            this._fuseProgressBarService.hide();
        }
        );
    }
    // Set stepper by index
    public setStepper(index: number): void {
        this.stepper.linear = false
        this._currentStep = index;
        this.stepper.selectedIndex = this._currentStep;
        setTimeout(() => {
            this.stepper.linear = true;
        });
    }

}
