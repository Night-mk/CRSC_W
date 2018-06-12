import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
    selector: 'app-course-management',
    templateUrl: './courseManagement.component.html',
    styleUrls: ['./courseManagement.component.less']
})
export class CourseManagementComponent {
    form: FormGroup;
    submitting=false;
    constructor(private http: _HttpClient,private fb: FormBuilder, private msg: NzMessageService,private notification: NzNotificationService) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            courseName: [ null, [ Validators.required ] ],
            courseID: [ null, [ Validators.required ] ],
            courseTime: [ null, [ Validators.required ] ],
            school: [ null, [ Validators.required ] ],
            college: [ null, [ Validators.required ] ],
            profession: [ null, [ Validators.required ] ],

        });
    }
    // createNotification(type: string): void {
    //     this.notification.create(type, '添加成功',
    //         '恭喜添加了新的课程');
    // }
    submit() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.submitting = true;
        setTimeout(() => {
            this.submitting = false;
            this.msg.success(`提交成功`);
        }, 1000);
    }

}
