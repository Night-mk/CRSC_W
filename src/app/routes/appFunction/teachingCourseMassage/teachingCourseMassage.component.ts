import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {map, tap} from 'rxjs/operators';
import {SimpleTableColumn, SimpleTableComponent} from '@delon/abc';
import {NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {SkipService} from './skip.service';

@Component({
    selector: 'app-teaching-course-massage',
    templateUrl: './teachingCourseMassage.component.html',
    styleUrls: ['./teachingCourseMassage.component.less'],
    providers: [SkipService]
})

export class TeachingCourseMassageComponent implements AfterViewInit{

    constructor(public skip: SkipService){

    }

    ngAfterViewInit() {
        console.log('item', this.skip);
    }
}