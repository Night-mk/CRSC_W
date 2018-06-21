import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import {BasicManagementRoutingModule} from './basicManagement-routing.module';
import {TimeTableComponent} from './timeTable/timeTable.component';
import {SignRuleComponent} from './signRule/signRule.component';
import {OrganizationComponent} from './organization/organization.component';
import {AddOrganizationComponent} from "./organization/addOrganization.component";
import {OrganizationListComponent} from "./organization/organizationList.component";
import {AddCollegeComponent} from "./organization/addCollege.component";


const COMPONENTS = [
    TimeTableComponent,
    SignRuleComponent,
    OrganizationComponent,

];

const COMPONENTS_NOROUNT = [
    AddOrganizationComponent,
    OrganizationListComponent,
    AddCollegeComponent,
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        BasicManagementRoutingModule
    ],
    providers: [  ],
    declarations: [
        COMPONENTS,
        COMPONENTS_NOROUNT
    ]
})
export class BasicManagementModule { }
