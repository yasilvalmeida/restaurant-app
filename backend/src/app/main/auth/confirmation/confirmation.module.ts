import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { FuseSharedModule } from '@fuse/shared.module';

import { ConfirmationComponent } from 'app/main/auth/confirmation/confirmation.component';

const routes = [
    {
        path     : 'confirmation',
        component: ConfirmationComponent
    }
];

@NgModule({
    declarations: [
        ConfirmationComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class ConfirmationModule
{
}
