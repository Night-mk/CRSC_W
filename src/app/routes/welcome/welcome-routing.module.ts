import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import {WelcomeComponent} from './welcome.component';


const routes: Routes = [
    { path: 'welcome-page', component: WelcomeComponent},

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
export class WelcomeRoutingModule { }