import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-teaching-course-massage',
    templateUrl: './teachingCourseMassage.component.html',
    styleUrls: ['./teachingCourseMassage.component.less']
})

export class TeachingCourseMassageComponent {
    constructor(private http: _HttpClient) {

    }
}