import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import {CourseManagementComponent} from './courseManagement/courseManagement.component';
import {SignManagementComponent} from './signManagement/signManagement.component';
import {TeachingCourseMassageComponent} from './teachingCourseMassage/teachingCourseMassage.component';


const routes: Routes = [
    { path: 'course-management', component: CourseManagementComponent },
    { path: 'sign-management', component: SignManagementComponent },
    { path: 'teaching-course-massage', component: TeachingCourseMassageComponent }

    // { path: 'simple-table', component: SimpleTableComponent },
    // { path: 'clipboard', component: ClipboardComponent },
    // { path: 'print', component: PrintComponent },
    // { path: 'acl', component: ACLComponent },
    // {
    //     path: 'guard',
    //     component: GuardComponent,
    //     children: [
    //         { path: 'leave', component: GuardLeaveComponent, canDeactivate: [ CanLeaveProvide ] },
    //         { path: 'auth', component: GuardAuthComponent, canActivate: [ ACLGuard ], data: { guard: 'user1' } },
    //         { path: 'admin', component: GuardAdminComponent, canActivate: [ ACLGuard ], data: { guard: 'admin' } }
    //     ]
    // },
    // { path: 'cache', component: CacheComponent },
    // { path: 'downfile', component: DownFileComponent },
    // { path: 'xlsx', component: XlsxComponent },
    // { path: 'zip', component: ZipComponent },
    // { path: 'form', component: DelonFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppFunctionRoutingModule { }