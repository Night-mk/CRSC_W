import {Component, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SkipService } from './skip.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-add-course',
    templateUrl: './addCourse.component.html'
})
export class AddCourseComponent implements OnInit{
    form: FormGroup;
    loading = false;
    isVisible = false;
    detailsDataSet: any;

    //选择的课程id
    chooseCourseId: string;

    constructor(private http: _HttpClient,
                public skip: SkipService,
                private fb: FormBuilder) {
        this.detailsDataSet = [
            {
                course_name: '《大学英语》',
                courseId: '162505'
            },
            {
                course_name: '《计算机组成原理》',
                courseId: '162506'
            },
            {
                course_name: '《大学英语》',
                courseId: '162505'
            },
            {
                course_name: '《计算机组成原理》',
                courseId: '162506'
            },
            {
                course_name: '《大学英语》',
                courseId: '162505'
            },
            {
                course_name: '《计算机组成原理》',
                courseId: '162506'
            }
        ];
    }

    ngOnInit(){
        this.form = this.fb.group({
            term_year: [null, Validators.compose([Validators.required])],
            term: [null, Validators.compose([Validators.required])],
            course_name: [null, [Validators.required]]
            // receiver_type: [null, [Validators.required]],
            // receiver_account: [null, [Validators.required]],
            // receiver_name: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
            // amount: [null, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(1), Validators.max(10000 * 100)])]
        });
    }

    /**
     * 获取form里的数据
     */
    get course_name() { return this.form.controls['course_name']; }

    /**
     * 修改form的值
     * @param key
     * @param value
     */
    changeFormValue(key, value){
        this.form.patchValue({key: value});
    }

    /**
     * 选择课程
     */
    chooseCourse(course_data){
        //获取course_id
        this.chooseCourseId = course_data.courseId;
        //改变input框的值
        // this.changeFormValue('course_name', course_data.course_name);
        this.form.patchValue({course_name: course_data.course_name});
        console.log(course_data);
        //关闭模态框
        this.handleCancel();
    }

    /**
     * 提交添加课程请求
     */
    addCourse(){
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            --this.skip.step;
        }, 1000 * 2);
    }

    /**
     * 返回上一页
     */
    prev(){
        --this.skip.step;
    }

    showModal(): void {
        //请求查询当前课程对应的详细信息
        this.isVisible = true;
    }

    handleOk(): void {
        console.log('Button ok clicked!');
        this.isVisible = false;
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
    }

}