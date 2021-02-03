import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { VerifyEmailComponent } from 'app/main/auth/verify-email/verify-email.component';

const routes = [
    {
        path     : 'verify-email',
        component: VerifyEmailComponent
    }
];

@NgModule({
    declarations: [
        VerifyEmailComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule,
    ]
})
export class VerifyEmailModule
{
}
