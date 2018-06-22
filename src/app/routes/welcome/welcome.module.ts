import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import {WelcomeComponent} from './welcome.component';
import {WelcomeRoutingModule} from './welcome-routing.module';

const COMPONENTS = [
    WelcomeComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        WelcomeRoutingModule
    ],
    providers: [  ],
    declarations: COMPONENTS
})
export class WelcomeModule { }