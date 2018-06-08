import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-menu-management',
    templateUrl: './menuManagement.component.html',
    styleUrls: ['./menuManagement.component.less']
})
export class MenuManagementComponent {
    constructor(private http: _HttpClient) {

    }
}