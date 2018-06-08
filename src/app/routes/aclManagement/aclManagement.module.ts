import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import {AclManagementRoutingModule} from './aclManagement-routing.module';
import {MenuManagementComponent} from './menuManagement/menuManagement.component';
import {RoleManagementComponent} from './roleManagement/roleManagement.component';
import {UserManagementComponent} from './userManagement/userManagement.component';

const COMPONENTS = [
    MenuManagementComponent,
    RoleManagementComponent,
    UserManagementComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AclManagementRoutingModule
    ],
    providers: [  ],
    declarations: COMPONENTS
})
export class AclManagementModule { }