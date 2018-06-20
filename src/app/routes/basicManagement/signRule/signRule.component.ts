import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-sign-rule',
    templateUrl: './signRule.component.html'
})
export class SignRuleComponent {

    constructor(private http: _HttpClient){

    }

}