import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import {MenuManagementComponent} from './menuManagement/menuManagement.component';
import {RoleManagementComponent} from './roleManagement/roleManagement.component';
import {UserManagementComponent} from './userManagement/userManagement.component';


const routes: Routes = [
    { path: 'menu-management', component: MenuManagementComponent},
    { path: 'role-management', component: RoleManagementComponent},
    { path: 'user-management', component: UserManagementComponent}

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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AclManagementRoutingModule { }