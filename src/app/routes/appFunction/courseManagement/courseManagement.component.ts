import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {map, tap} from 'rxjs/operators';
import {SimpleTableColumn, SimpleTableComponent} from '@delon/abc';
import {NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {RouteService} from "./route.service";
import {RouterService} from '../../router.service';

@Component({
    selector: 'app-course-management',
    templateUrl: './courseManagement.component.html',
    styleUrls: ['./courseManagement.component.less'],
    providers: [RouteService, RouterService]
})

export class CourseManagementComponent implements AfterViewInit{

    constructor(public route:RouteService){

    }

    ngAfterViewInit() {
        console.log('item', this.route);
    }
}
