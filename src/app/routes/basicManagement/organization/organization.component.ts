import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {map, tap} from 'rxjs/operators';
import {SimpleTableColumn, SimpleTableComponent} from '@delon/abc';
import {NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {OrganizationRouteService} from "./organizationRoute.service";

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    // styleUrls: ['./courseManagement.component.less'],
    providers: [OrganizationRouteService]
})

export class OrganizationComponent implements AfterViewInit{

    constructor(public Oroute:OrganizationRouteService){

    }

    ngAfterViewInit() {
        console.log('item', this.Oroute);
    }
}
