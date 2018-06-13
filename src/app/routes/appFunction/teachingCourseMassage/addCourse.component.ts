import {Component, Inject, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SkipService } from './skip.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
    selector: 'app-add-course',
    templateUrl: './addCourse.component.html'
})
export class AddCourseComponent implements OnInit{
    form: FormGroup;
    loading = false;
    isVisible = false;
    courseList: any;



    //接口链接
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        getAllCourseUrl: this.urlTemplate+'Curriculum/read/',
        editCourseUrl: this.urlTemplate+'Instruction/edit/'
    };

    //添加课程提交信息（特殊数据）
    AddCourseList = {
        term_id: null,
        //选择的课程id
        chooseCourseId: null,
        student_number: null,
        term_year: null
    };

    constructor(private http: _HttpClient,
                public skip: SkipService,
                private fb: FormBuilder,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private notification: NzNotificationService,) {
        this.courseList = [];
    }

    ngOnInit(){
        this.form = this.fb.group({
            term_year: [null, Validators.compose([Validators.required])],
            term: [null, Validators.compose([Validators.required])],
            student_number: [null, Validators.compose([Validators.required])],
            course_name: [null, Validators.compose([Validators.required])]
            // receiver_type: [null, [Validators.required]],
            // receiver_account: [null, [Validators.required]],
            // receiver_name: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
            // amount: [null, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(1), Validators.max(10000 * 100)])]
        });
    }

    /**
     * 获取form里的数据
     */
    get term_year() { return this.form.controls['term_year']; }
    get term() { return this.form.controls['term']; }
    get student_number() { return this.form.controls['student_number']; }
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
     * 打开查询课程模态框
     */
    openChooseCourseModal(){
        this.loading = true;
        this.getAllCourse();
    }

    /**
     * 获取全部课程并设置
     */
    getAllCourse(){
        let url = this.requestUrlList.getAllCourseUrl+
            'uid/'+this.tokenService.get().uid+'/gid/'+this.tokenService.get().gid;
        this.http.get(
            url
        ).subscribe((data)=>{
            if(data['status']==0){
                let allcourse = data['data'];
                this.courseList = allcourse;
                console.log(allcourse);
                //打开模态框
                this.loading = false;
                this.showModal();
            }else{
                this.createBasicNotification('获取课程','获取成功');
                console.log('get all course error');
            }
        },response=>{
            console.log("GET call in error", response);
        });
    }

    /**
     * 选择课程
     */
    chooseCourse(course_data){
        //获取course_id并设置系统课程id
        this.AddCourseList.chooseCourseId = course_data.id;
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

            let url = this.requestUrlList.editCourseUrl+
                '/teaching_year/'+this.AddCourseList.term_year+'/term/'+this.AddCourseList.term_id+
                '/course_id/'+this.AddCourseList.chooseCourseId+'/teacher_id/'+this.tokenService.get().uid+
                '/student_number/'+this.AddCourseList.student_number;
            console.log(url);
            this.http.get(
                url
            ).subscribe((data)=>{
                if(data['status']==0){
                    this.createBasicNotification('添加课程','添加成功');
                    this.skip.step = 0;
                }else{
                    console.log('add course error');

                }
            },response=>{
                console.log("GET call in error", response);
            });


        }, 1000 * 2);
    }

    /**
     * 返回上一页
     */
    prev(){
        --this.skip.step;
    }


    //-----------------------------------------------------------
    // 提示框服务
    // 模态框服务
    //-----------------------------------------------------------

    /**
     * 简单提示框
     * @param title
     * @param content
     */
    createBasicNotification(title, content): void {
        this.notification.blank( title, content);
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