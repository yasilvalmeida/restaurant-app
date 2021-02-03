import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/tr';

import { AuthService } from 'app/main/service/auth.service';

@Component({
  selector     : 'register',
  templateUrl  : './register.component.html',
  styleUrls    : ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  _errorMessage: string = "";
  _acceptTerms: boolean = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translate: TranslateService
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.registerForm = this._formBuilder.group({
            fullname       : ['', Validators.required],
            email          : ['', [Validators.required, Validators.email]],
            password       : [
                '', [
                    Validators.required, 
                    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
                ] 
            ],
            passwordConfirm: [
                '', [
                    Validators.required, 
                    confirmPasswordValidator
                ]
            ],
            terms          : [
                false, Validators.required
            ]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
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

    acceptTermsEvent(event) {
        this._acceptTerms = event.checked;
    }

    // Register a user
    register(): void {
        // Show the progress bar
        this._fuseProgressBarService.show();

        let fullname        = this.registerForm.get('fullname').value,
            email           = this.registerForm.get('email').value,
            password        = this.registerForm.get('password').value;
        if (!this._acceptTerms) {
            this._errorMessage = "Please accept terms first!";
            this._fuseProgressBarService.hide();
            return;
        }
        this._authService.register({
            fullname,
            email,
            password
        })
        .subscribe
        (
            data => {
                // Hide the progress bar
                this._fuseProgressBarService.hide();
                if (data.ok)
                    window.location.href = "/confirmation";
            },
            error => {
                // Hide the progress bar
                this._fuseProgressBarService.hide();
                this._translate.get('MESSAGE.' + error)
                .subscribe((translatedMessage: string) => {
                    this._errorMessage = translatedMessage;
                });
            }
        );
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};
