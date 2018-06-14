import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { AppFunctionRoutingModule } from './appFunction-routing.module';
import {CourseManagementComponent} from './courseManagement/courseManagement.component';
import {SignManagementComponent} from './signManagement/signManagement.component';
import {TeachingCourseMassageComponent} from './teachingCourseMassage/teachingCourseMassage.component';
import {AddCourseComponent} from './teachingCourseMassage/addCourse.component';
import {SearchCourseComponent} from './teachingCourseMassage/searchCourse.component';
import {CourseDetailComponent} from './teachingCourseMassage/courseDetail.component';
import {SignDetailComponent} from './teachingCourseMassage/signDetail.component';

const COMPONENTS = [
    CourseManagementComponent,
    SignManagementComponent,
    TeachingCourseMassageComponent
];

const COMPONENTS_NOROUNT = [
    AddCourseComponent,
    SearchCourseComponent,
    CourseDetailComponent,
    SignDetailComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AppFunctionRoutingModule
    ],
    providers: [  ],
    declarations: [
        COMPONENTS,
        COMPONENTS_NOROUNT
    ]
})
export class AppFunctionModule { }