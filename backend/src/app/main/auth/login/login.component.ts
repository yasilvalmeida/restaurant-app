import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/tr';

import SimpleCrypto from 'simple-crypto-js';

import { environment } from 'environments/environment';

import { AuthService } from 'app/main/service/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit {

   loginForm: FormGroup;
   _localErrorMessage: string = "";
   _googleErrorMessage: string = "";
   _sessionSecret = environment.sessionSecret;
   _googleClientId = environment.googleClientId;

    public _gapiSetup: boolean = false; // marks if the gapi library has been loaded
    public _authInstance: gapi.auth2.GoogleAuth;
    public _error: string;
    public _user: gapi.auth2.GoogleUser;

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
    async ngOnInit(): Promise<any>
    {
        //localStorage.removeItem("_id")
        console.log(localStorage)
        this.loginForm = this._formBuilder.group({
            email   : [
                '', [
                    Validators.required, Validators.email
                ]
            ],
            password: [
                '', [
                    Validators.required, 
                    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
                ] 
            ]
        });
        if (await this.checkIfUserAuthenticated()) {
            this._user = this._authInstance.currentUser.get();
        }
    }
    async initGoogleAuth(): Promise<void> {
        //  Create a new Promise where the resolve function is the callback
        // passed to gapi.load
        const pload = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        });

        // When the first promise resolves, it means we have gapi loaded
        // and that we can call gapi.init
        return pload.then(async () => {
        await gapi.auth2
            .init({ client_id: this._googleClientId })
            .then(auth => {
                this._gapiSetup = true;
                this._authInstance = auth;
            });
        });
    }

    async authenticate(): Promise<any> {
        // Show the progress bar
        this._fuseProgressBarService.show();
        // Initialize gapi if not done yet
        if (!this._gapiSetup) {
            await this.initGoogleAuth();
        }

        // Resolve or reject signin Promise
        return new Promise(async () => {
        await this._authInstance.signIn().then(
            user => {
                this._user = user;
                const data: any = user; 
                //console.log(data.xc.id_token)
                let tokenId = data.xc.id_token;
                this._authService.googleSignIn({
                    tokenId
                })
                .subscribe
                (
                    data => {
                        // Hide the progress bar
                        this._fuseProgressBarService.hide();
                        //console.log("data", data)
                        if (data.ok) {
                            let _id       = data.user._id,
                                token     = data.token,
                                fullname  = data.user.fullname,
                                email     = data.user.email,
                                role      = data.user.role,
                                avatarBuf = data.user.avatar.data;
                            
                            let TYPED_ARRAY = new Uint8Array(avatarBuf);
                            /* const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY); */
                            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
                                return data + String.fromCharCode(byte);
                            }, '');
                            let avatar = btoa(STRING_CHAR);
                            //console.log(base64String)

                            localStorage.setItem('_id', _id);
                            localStorage.setItem('token', token);
                            localStorage.setItem('fullname', fullname);
                            localStorage.setItem('email', email);
                            localStorage.setItem('role', role);
                            localStorage.setItem('avatar', avatar);
                            window.location.href = "/dashboard";
                        }
                    },
                    error => {
                        // Hide the progress bar
                        this._fuseProgressBarService.hide();
                        this._translate.get('MESSAGE.' + error)
                        .subscribe((translatedMessage: string) => {
                            this._googleErrorMessage = translatedMessage;
                        });
                    }
                );
            },
            error => {
                this._error = error
                console.log(error);
            });
        });
    }

    async checkIfUserAuthenticated(): Promise<boolean> {
        // Initialize gapi if not done yet
        if (!this._gapiSetup) {
            await this.initGoogleAuth();
        }

        return this._authInstance.isSignedIn.get();
    }

    login() {
        // Show the progress bar
        this._fuseProgressBarService.show();

        let email    = this.loginForm.get('email').value,
            password = this.loginForm.get('password').value;
        this._authService.login({
            email,
            password
        })
        .subscribe
        (
            data => {
                // Hide the progress bar
                this._fuseProgressBarService.hide();
                //console.log(data)
                if (data.ok) {
                    let _id       = data.user._id,
                        token     = data.token,
                        fullname  = data.user.fullname,
                        email     = data.user.email,
                        role      = data.user.role,
                        avatarBuf = data.user.avatar.data;
                    
                    let TYPED_ARRAY = new Uint8Array(avatarBuf);
                    /* const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY); */
                    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
                        return data + String.fromCharCode(byte);
                    }, '');
                    let avatar = btoa(STRING_CHAR);
                    //console.log(base64String)
                    localStorage.setItem('_id', _id);
                    localStorage.setItem('token', token);
                    localStorage.setItem('fullname', fullname);
                    localStorage.setItem('email', email);
                    localStorage.setItem('role', role);
                    localStorage.setItem('avatar', avatar);
                    window.location.href = "/dashboard";
                }
            },
            error => {
                // Hide the progress bar
                this._fuseProgressBarService.hide();
                this._translate.get('MESSAGE.' + error)
                .subscribe((translatedMessage: string) => {
                    this._localErrorMessage = translatedMessage;
                });
            }
        );
    }

    googleSignIn() {
        this.authenticate();
    }
}
