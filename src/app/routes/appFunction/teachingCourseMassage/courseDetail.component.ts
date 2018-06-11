import {Component, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SkipService } from './skip.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-course-detail',
    templateUrl: './courseDetail.component.html'
})
export class CourseDetailComponent implements OnInit{
    form: FormGroup;
    loading = false;
    detailsDataSet: any;

    //选择的课程id
    chooseCourseId: string;

    constructor(private http: _HttpClient,
                public skip: SkipService,
                private fb: FormBuilder) {

    }

    ngOnInit(){
        this.form = this.fb.group({
            week: [null, Validators.compose([Validators.required])],
            time: [null, Validators.compose([Validators.required])]
        });
    }

}