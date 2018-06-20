import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-time-table',
    templateUrl: './timeTable.component.html'
})
export class TimeTableComponent {

    constructor(private http: _HttpClient){

    }

}