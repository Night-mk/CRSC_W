import {Component, OnInit, ViewChild} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {map, tap} from 'rxjs/operators';
import {SimpleTableColumn, SimpleTableComponent} from '@delon/abc';
import {NzNotificationService} from 'ng-zorro-antd';
import {SkipService} from './skip.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-search-course',
    templateUrl: './searchCourse.component.html'
})

export class SearchCourseComponent implements OnInit{

    form: FormGroup;
    isVisible = false;
    loading = false;
    courseUrl = '';

    //记录当前选择的课程id
    currentCourseId: string;

    courseDetailData: any[] = [];

    @ViewChild('st') st: SimpleTableComponent;
    columns: SimpleTableColumn[] = [
        { title: '', index: 'key', type: 'checkbox' },
        { title: '学年信息', index: 'term_year' },
        { title: '学期信息', index: 'term' },
        { title: '课程编号', index: 'course_No'},
        { title: '课程名称', index: 'course_name'},
        {
            title: '操作',
            buttons: [
                { text: '删除', click: (item: any) => this.deleteCourse(item) },
                { text: '添加课程表', click: () => this.openAddCourseDetailModel() },
                { text: '生成二维码', click: (item: any) => this.generateORCode(item) },
                { text: '课程详情', click: () =>  this.openCourseDetailPage() }
            ]
        }
    ];

    constructor(private http: _HttpClient,
                private notification: NzNotificationService,
                public skip: SkipService,
                private fb: FormBuilder) {
        this.courseDetailData = [
            {
                term_year: '2018-2019学年',
                term: '秋季学期',
                course_No: '0056007',
                course_name: '计算机网络'
            },
            {
                term_year: '2018-2019学年',
                term: '秋季学期',
                course_No: '0056007',
                course_name: '计算机网络'
            }
        ];
    }

    ngOnInit(){
        this.form = this.fb.group({
            start_week: [null, Validators.compose([Validators.required])],
            end_week: [null, Validators.compose([Validators.required])],
            week: [null, Validators.compose([Validators.required])],
            time: [null, Validators.compose([Validators.required])],
            course_address: [null, [Validators.required]]
        });
    }

    /**
     * 获取form数据
     * @returns {AbstractControl}
     */
    get start_week(){ return this.form.controls['start_week'];}
    get end_week(){ return this.form.controls['end_week'];}
    get week(){ return this.form.controls['week'];}
    get time(){ return this.form.controls['time'];}
    get course_address(){ return this.form.controls['course_address'];}

    /**
     * 获取教师相关课程信息
     */
    getCourseData() {
        this.loading = true;
        setTimeout(()=>{
            //发起请求
            let teacherId = {};

            this.http.post(
                this.courseUrl,
                teacherId
            ).subscribe((data)=>{
                console.log(data);
                this.loading = false;
            },response=>{
                console.log("POST call in error", response);
            })

        }, 1000);
        this.loading = false;
    }

    /**
     * 打开添加课程页面
     */
    openAddCoursePage(){
        ++this.skip.step;
    }

    /**
     * 打开课程详情页面
     */
    openCourseDetailPage(){
        this.skip.step = 2;
    }

    /**
     * 删除课程
     * @param courseId
     */
    deleteCourse(courseId){
        let teacherId = '';
        let deleteUrl = '';
        let payload = {
            teacher: teacherId,
            courseId: courseId
        };
        this.http.get(
            deleteUrl,
            payload
        ).subscribe((data)=>{
            console.log("delete data");
            if(data['status']==0){
                this.createBasicNotification('删除课程','删除成功');
            }else{
                this.createBasicNotification('删除课程','删除失败');
            }
        },response => {
            console.log("delete err");
            console.log("GET call in error", response);
            this.createBasicNotification('删除课程','删除请求提交失败，请检查网络并重试');
        });
    }
    /**
     * 添加课程表细节
     * @param courseId
     */
    addCourseDetail(courseId){
        let addCourseDetailUrl = '';
        let body = '';
        //获取body数据
        this.http.post(
            addCourseDetailUrl,
            body
        ).subscribe((data)=>{
            if(data['status']==0){
                this.createBasicNotification('添加课程细节','添加成功');
            }else{
                this.createBasicNotification('添加课程','添加失败');
            }
        },response => {
            console.log("GET call in error", response);
            this.createBasicNotification('添加课程','添加请求提交失败，请检查网络并重试');
        });
    }
    /**
     * 生成课程二维码
     * @param courseId
     */
    generateORCode(courseId){
        let generateORCodeUrl = '';
        let body = '';
        this.http.post(
            generateORCodeUrl,
            body
        ).subscribe((data)=>{
            if(data['status']==0){
                this.createBasicNotification('生成课程二维码','生成成功');
            }else{
                this.createBasicNotification('生成课程二维码','生成失败');
            }
        },response => {
            console.log("GET call in error", response);
            this.createBasicNotification('生成课程二维码','生成请求提交失败，请检查网络并重试');
        });
    }

    /**
     * 打开添加课程表模态框
     */
    openAddCourseDetailModel(){
        this.showModal();
    }
    /**
     * 关闭添加课程表细节模态框
     */
    closeAddCourseDetailModel(){

    }

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