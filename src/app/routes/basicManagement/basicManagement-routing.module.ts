import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import {TimeTableComponent} from './timeTable/timeTable.component';
import {SignRuleComponent} from './signRule/signRule.component';
import {OrganizationComponent} from './organization/organization.component';


const routes: Routes = [
    { path: 'time-table', component: TimeTableComponent },
    { path: 'sign-rule', component: SignRuleComponent },
    { path: 'organization', component: OrganizationComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BasicManagementRoutingModule { }