import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

// My Services, Interceptors and AuthGuard
import { TokenInterceptor } from './main/service/token.interceptor';
import { AuthGuard } from './main/service/auth.guard';
import { AuthService } from './main/service/auth.service';
import { SettingsService } from './main/service/settings.service';
import { UsersService } from './main/service/users.service';
import { ChatService } from './main/service/chat.service';

// My Modules
import { RegisterModule } from './main/auth/register/register.module';
import { LoginModule } from './main/auth/login/login.module';
import { ConfirmationModule } from './main/auth/confirmation/confirmation.module';
import { VerifyEmailModule } from './main/auth/verify-email/verify-email.module';
import { ForgotPasswordModule } from './main/auth/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './main/auth/reset-password/reset-password.module';
import { DashboardModule } from './main/dashboard/dashboard.module';
import { ProfileModule } from './main/auth/profile/profile.module';
import { SettingsModule } from './main/settings/settings.module';
import { UsersModule } from './main/users/users.module';
import { ChatModule } from './main/chat/chat.module';


let token = localStorage.getItem('token');

const appRoutes: Routes = [
    {
        path       : '**',
        redirectTo : 'login'
    },
    {
        path       : 'register',
        redirectTo : 'register'
    },
    {
        path       : 'confirmation',
        redirectTo : 'confirmation'
    },
    {
        path       : 'verify-email',
        redirectTo : 'verify-email'
    },
    {
        path       : 'forgot-password',
        redirectTo : 'forgot-password'
    },
    {
        path       : 'reset-password',
        redirectTo : 'reset-password'
    },
    {
        path       : 'dashboard',
        redirectTo : 'dashboard',
        canActivate: [AuthGuard]
    },
    {
        path       : 'profile',
        redirectTo : 'profile',
        canActivate: [AuthGuard],
    },
    {
        path       : 'settings',
        redirectTo : 'settings',
        canActivate: [AuthGuard],
    },
    {
        path       : 'users',
        redirectTo : 'users',
        canActivate: [AuthGuard],
    },
    {
        path       : 'chat',
        redirectTo : 'chat',
        canActivate: [AuthGuard],
    }
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        ConfirmationModule,
        LoginModule,
        RegisterModule,
        VerifyEmailModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        DashboardModule,
        ProfileModule,
        SettingsModule,
        UsersModule,
        ChatModule
    ],
    providers:[
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        SettingsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        UsersService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        ChatService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        AuthGuard
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
