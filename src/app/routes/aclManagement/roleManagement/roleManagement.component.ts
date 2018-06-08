import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-role-management',
    templateUrl: './roleManagement.component.html',
    styleUrls: ['./roleManagement.component.less']
})
export class RoleManagementComponent {
    constructor(private http: _HttpClient) {

    }
}