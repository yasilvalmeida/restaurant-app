import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/tr';

import { AuthService } from 'app/main/service/auth.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  _errorMessage: string = "";
  /**
  * Constructor
  *
  * @param {FuseConfigService} _fuseConfigService
  * @param {FormBuilder} _formBuilder
  */
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
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  // Forgot password
  forgotPassword(): void {
    // Show the progress bar
    this._fuseProgressBarService.show();

    let email = this.forgotPasswordForm.get('email').value;
    this._authService.forgotPassword({
      email
    })
    .subscribe
    (
      data => {
        // Hide the progress bar
        this._fuseProgressBarService.hide();
        console.log(data)
        if (data.ok)
          window.location.href = "/confirmation";
      },
      error => {
        console.log(error);
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
