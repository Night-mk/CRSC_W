import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {SkipService} from './skip.service';
import {RouterService} from '../../router.service';

@Component({
    selector: 'app-teaching-course-massage',
    templateUrl: './teachingCourseMassage.component.html',
    styleUrls: ['./teachingCourseMassage.component.less'],
    providers: [SkipService, RouterService]
})

export class TeachingCourseMassageComponent implements AfterViewInit{

    constructor(public skip: SkipService){

    }

    ngAfterViewInit() {
        console.log('item', this.skip);
    }
}