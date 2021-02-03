import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MaterialFileInputModule } from 'ngx-mat-file-input';
 
import { FuseSharedModule } from '@fuse/shared.module';

import { ProfileComponent } from './profile.component';
import { AboutComponent } from './about/about.component';

const routes = [
    {
        path     : 'profile',
        component: ProfileComponent,
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        AboutComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,

        MaterialFileInputModule,

        FuseSharedModule
    ],
    providers   : [
    ]
})
export class ProfileModule
{
}
