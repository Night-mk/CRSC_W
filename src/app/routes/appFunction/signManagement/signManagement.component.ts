import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-sign-management',
    templateUrl: './signManagement.component.html',
    styleUrls: ['./signManagement.component.less']
})
export class SignManagementComponent {
    constructor(private http: _HttpClient) {

    }
}