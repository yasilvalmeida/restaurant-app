import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/tr';

import { AuthService } from 'app/main/service/auth.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  _errorMessage: string = "";

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
      private _fuseConfigService: FuseConfigService,
      private _formBuilder: FormBuilder,
      private _authService: AuthService,
      private _route: ActivatedRoute,
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
    this.resetPasswordForm = this._formBuilder.group({
      token           : ['', Validators.required],
      password        : [
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
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.resetPasswordForm.get('password').valueChanges
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
        });

    this._route.queryParams
      .subscribe(params => {
        let token = params.token;
        if (token == undefined)
          window.location.href = "/login";
        else {
          this.resetPasswordForm.setValue({
            token,
            password: '',
            passwordConfirm: ''
          });
        }
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
  // Reset password
  resetPassword(): void {
      // Show the progress bar
      this._fuseProgressBarService.show();

      let token    = this.resetPasswordForm.get('token').value,
          password = this.resetPasswordForm.get('password').value;
      console.log(token)
      console.log(password)
      this._authService.resetPassword({
          token,
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
