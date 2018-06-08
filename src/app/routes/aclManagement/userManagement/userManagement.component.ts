import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-user-management',
    templateUrl: './userManagement.component.html',
    styleUrls: ['./userManagement.component.less']
})

export class UserManagementComponent {
    constructor(private http: _HttpClient) {

    }
}