import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class VerifyEmailComponent implements OnInit {

  verifyEmailForm: FormGroup;
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
    private _route: ActivatedRoute,
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
    this.verifyEmailForm = this._formBuilder.group({
      token       : ['', Validators.required],
    });
    this._route.queryParams
      .subscribe(params => {
        let token = params.token;
        if (token == undefined)
          window.location.href = "/login";
        else {
          this.verifyEmailForm.setValue({
            token,
          });
        }
      }
    );
  }
  // Verify email
  verifyEmail(): void {
      // Show the progress bar
      this._fuseProgressBarService.show();

      let token = this.verifyEmailForm.get('token').value;
      this._authService.verifyEmail({
          token
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
 