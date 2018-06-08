import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-course-management',
    templateUrl: './courseManagement.component.html',
    styleUrls: ['./courseManagement.component.less']
})
export class CourseManagementComponent {
    constructor(private http: _HttpClient) {

    }
}