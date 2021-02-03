import { Component, OnInit } from '@angular/core';

import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import SimpleCrypto from 'simple-crypto-js';

import { environment } from 'environments/environment';

import { AuthService } from 'app/main/service/auth.service';

@Component({
    selector   : 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls  : ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit
{
    _sessionSecret = environment.sessionSecret;
    _token;
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _authService: AuthService,
        private _fuseProgressBarService: FuseProgressBarService,
    )
    {
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
        //const encryptInit = new SimpleCrypto(this._sessionSecret);
        //let encryptedToken = localStorage.getItem('token');
        //this._token = encryptInit.decrypt(encryptedToken);
        let token = localStorage.getItem('token');
        //console.log(localStorage)
        //console.log("token", token)
        if (token == "undefined" || 
            token == "" ||
            token == null) {
                window.location.href = "/login";
            }
        this._token = token;
    }
}
