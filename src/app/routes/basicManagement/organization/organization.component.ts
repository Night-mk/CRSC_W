import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html'
})
export class OrganizationComponent {

    constructor(private http: _HttpClient){

    }

}