import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { AppFunctionRoutingModule } from './appFunction-routing.module';
import {CourseManagementComponent} from './courseManagement/courseManagement.component';
import {SignManagementComponent} from './signManagement/signManagement.component';
import {TeachingCourseMassageComponent} from './teachingCourseMassage/teachingCourseMassage.component';

const COMPONENTS = [
    CourseManagementComponent,
    SignManagementComponent,
    TeachingCourseMassageComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AppFunctionRoutingModule
    ],
    providers: [  ],
    declarations: COMPONENTS
})
export class AppFunctionModule { }