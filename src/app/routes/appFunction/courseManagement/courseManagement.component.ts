import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
// import { NzNotificationService } from 'ng-zorro-antd';




@Component({
    selector: 'app-course-management',
    templateUrl: './courseManagement.component.html',
    styleUrls: ['./courseManagement.component.less']
})
export class CourseManagementComponent implements OnInit {
    form: FormGroup;
    submitting=false;
    // selectedProvince = 'Zhejiang';
    // selectedCity = 'Hangzhou';
    // provinceData = [ 'Zhejiang', 'Jiangsu' ];
    // cityData = {
    //     Zhejiang: [ 'Hangzhou', 'Ningbo', 'Wenzhou' ],
    //     Jiangsu : [ 'Nanjing', 'Suzhou', 'Zhenjiang' ]
    // };
    //
    // provinceChange(value: string): void {
    //     this.selectedCity = this.cityData[ value ][ 0 ];
    // }

    school= [
        { index: 0, text: '福州大学', value: false, type: 'default', checked: false },
        { index: 1, text: '福建师范大学', value: false, type: 'processing', checked: false },
        { index: 2, text: '福建农林大学', value: false, type: 'success', checked: false },
        { index: 3, text: '福建工程学院', value: false, type: 'error', checked: false }
    ];

    college=[
        { index:0, text:'数计学院', value:false,type:'default', checked:false},
        { index: 1, text: '经管学院', value: false, type: 'processing', checked: false },
        { index: 2, text: '物信学院', value: false, type: 'success', checked: false },
        { index: 3, text: '电气学院', value: false, type: 'error', checked: false }
    ];

    profession=[
        { index:0, text:'数计学院', value:false,type:'default', checked:false},
        { index: 1, text: '经管学院', value: false, type: 'processing', checked: false },
        { index: 2, text: '物信学院', value: false, type: 'success', checked: false },
        { index: 3, text: '电气学院', value: false, type: 'error', checked: false }
    ]


    constructor(private http: _HttpClient,private fb: FormBuilder, private msg: NzMessageService) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            courseName: [ null, [ Validators.required ] ],
            courseID: [ null, [ Validators.required ] ],
            courseTime: [ null, [ Validators.required ] ],

        });
    }
    // createNotification(type: string): void {
    //     this.notification.create(type, '添加成功',
    //         '恭喜添加了新的课程');
    // }
    submit() {
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.submitting = true;
        setTimeout(() => {
            this.submitting = false;
            this.msg.success(`提交成功`);
        }, 1000);
    }


}
