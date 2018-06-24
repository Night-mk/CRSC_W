import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {SimpleTableColumn, SimpleTableComponent} from '@delon/abc';
import {NzNotificationService} from 'ng-zorro-antd';
import {SkipService} from './skip.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {RouterService} from '../../router.service';

@Component({
    selector: 'app-search-course',
    templateUrl: './searchCourse.component.html'
})

export class SearchCourseComponent implements OnInit{

    form: FormGroup;
    isVisible = false;
    isQRVisible = false;
    isSLVisible = false;
    loading = false;

    //记录当前选择的课程id
    //选择选择处理的课程信息
    currentCourseId: string;

    //课程表展示数据
    courseDetailData: any[] = [];
    //接口请求url
    urlTemplate = this.rootRouter.rootRouter+'CRSS/index.php/';
    requestUrlList = {
        readAddressUrl : this.urlTemplate+'TeachingPlace/read',
        searchCourseArrangementUrl: this.urlTemplate+'Instruction/read',
        deleteCourseUrl: this.urlTemplate+'Instruction/delete',
        generateQRCodeUrl: this.urlTemplate+'QrCode/create_qrcode',
        readTimeTableUrl: this.urlTemplate+'TimeTable/read',
        addCourseDetailUrl: this.urlTemplate+'CoursePeriod/add',
        readStudentListUrl: this.urlTemplate+'StudentList/read',
        deleteStudentUrl: this.urlTemplate+'StudentList/delete',
        joinBlackListUrl: this.urlTemplate+'StudentList/join_blacklist',
    };
    QRUrl = null;

    //选择信息课程列表
    selectCourseList = {
        select_start_week: null,
        select_end_week: null,
        select_week: null,
        select_time: null,
        select_course_address: null
    };

    //学生列表信息
    studentList = {
        name: null,
        number: null
    };

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
                { text: '删除', click: (item: any) => this.deleteCourse(`${item.course_id}`) },
                { text: '添加课程表', click: (item: any) => this.openAddCourseDetailModel(`${item.course_id}`) },
                { text: '生成二维码', click: (item: any) => this.generateQRCode(`${item.course_id}`) },
                { text: '课程详情', click: (item: any) =>  this.openCourseDetailPage(`${item.course_id}`) },
                { text: '学生列表', click: (item: any) =>  this.openStudentListModel(`${item.course_id}`) }
            ]
        }
    ];

    constructor(private http: _HttpClient,
                private notification: NzNotificationService,
                public skip: SkipService,
                private fb: FormBuilder,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private rootRouter: RouterService) {

        this.getCourseData();
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
        //发起请求
        let url = this.requestUrlList.searchCourseArrangementUrl+'/uid/'+this.tokenService.get().uid;
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                this.courseDetailData = [];
                //处理相关数据
                for(let course_detail of data['data']){
                    let term_data = '';
                    if(course_detail.term==1){
                        term_data = this.skip.term[0].term_name;
                    }else{
                        term_data = this.skip.term[1].term_name;
                    }
                    let courseData = {
                            term_year: course_detail.teaching_year+'学年',
                            term: term_data,
                            course_No: course_detail.course_id,
                            course_name: course_detail.course_name,
                            course_id: course_detail.id
                        };
                    this.courseDetailData.push(courseData);
                }
                this.loading = false;
                console.log(this.courseDetailData);
            }else{
                this.createBasicNotification('查询授课安排','查询失败');
            }
            this.loading = false;
        },response=>{
            console.log("POST call in error", response);
        });

    }

    /**
     * 打开添加课程页面
     */
    openAddCoursePage(){
        ++this.skip.step;
    }

    /**
     * 删除课程
     * @param courseId
     */
    deleteCourse(courseId){
        let url = this.requestUrlList.deleteCourseUrl+'/id/'+courseId;
        console.log(url);
        this.http.get(
            url
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
     * 打开添加课程表模态框
     */
    openAddCourseDetailModel(courseId){
        this.showModal();
        this.getCourseAddressList();
        this.getTimeTableList();
        this.currentCourseId = courseId;
    }

    /**
     * 打开学生列表模态框
     */
    openStudentListModel(courseId){
        this.isSLVisible = true;
        this.getStudentList(courseId);
    }

    /**
     * 添加课程表细节
     * @param courseId
     */
    addCourseDetail(courseId){
        let url = this.requestUrlList.addCourseDetailUrl+'/begin/'+this.selectCourseList.select_start_week+
        '/end/'+this.selectCourseList.select_end_week+'/week/'+this.selectCourseList.select_week+
        '/uid/'+this.tokenService.get().uid+'/cid/'+courseId+'/room/'+this.selectCourseList.select_course_address+
        '/time/'+this.selectCourseList.select_time;
        console.log(url);

        //获取body数据
        this.http.get(
            url
        ).subscribe((data)=>{
            if(data['status']==0){
                this.createBasicNotification('添加课程细节','添加成功');
            }else{
                this.createBasicNotification('添加课程','添加失败');
            }
            this.handleCancel();
        },response => {
            console.log("GET call in error", response);
            this.createBasicNotification('添加课程','添加请求提交失败，请检查网络并重试');
            this.handleCancel();
        });
    }

    /**
     * 生成课程二维码
     * @param courseId
     */
    generateQRCode(courseId){
        let url = this.requestUrlList.generateQRCodeUrl+'/code/'+courseId;
        console.log(url);
        this.QRUrl = url;
        this.isQRVisible = true;
    }


    /**
     * 打开课程详情页面
     */
    openCourseDetailPage(courseId){
        this.skip.cid = courseId;
        this.skip.step = 2;
    }

    /**
     * 获取教学地点列表
     */
    getCourseAddressList(){
        let url = this.requestUrlList.readAddressUrl+
            '/gid/'+this.tokenService.get().gid+'/uid/'+this.tokenService.get().uid;

        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                //设置授课教室地址
                this.skip.course_address = data['data'];
                console.log('address get ok');
            }else{
                console.log('address get error');
            }
        },response => {
            console.log("GET call in error", response);
        });
    }

    /**
     * 获取授课时段信息
     */
    getTimeTableList(){
        let url = this.requestUrlList.readTimeTableUrl+
            '/oid/'+this.tokenService.get().oid;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                //设置授课时段信息
                this.skip.time = data['data'];
                console.log('timeTable get ok');
            }else{
                console.log('timeTable get error');
            }
        },response => {
            console.log("GET call in error", response);
        });
    }

    /**
     * 获取学生列表信息
     * @param courseId
     */
    getStudentList(courseId){
        let url = this.requestUrlList.readStudentListUrl+
            '/iid/'+courseId;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                //设置学生列表信息
                this.studentList = data['data'];
                console.log('studentList get ok');
            }else{
                console.log('studentList get error');
            }
        },response => {
            console.log("GET call in error", response);
        });
    }

    /**
     * 从授课安排中删除学生
     * @param student_id
     */
    deleteStudent(student_id){
        let url = this.requestUrlList.deleteStudentUrl+
            '/id/'+student_id;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                console.log('delete student get ok');
                this.createBasicNotification('删除学生','删除成功!');
            }else{
                console.log('delete student get error');
                this.createBasicNotification('删除学生','删除失败!');
            }
            this.handleCancel();
        },response => {
            console.log("GET call in error", response);
            this.createBasicNotification('删除学生','删除请求提交失败，请检查网络并重试');
        });
    }

    /**
     * 将人员加入黑名单
     * @param student_id
     */
    joinBlackList(student_id){
        let url = this.requestUrlList.joinBlackListUrl+
            '/id/'+student_id;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                console.log('join black list get ok');
                this.createBasicNotification('加入黑名单','加入黑名单成功!');
            }else{
                console.log('join black list get error');
                this.createBasicNotification('加入黑名单','加入黑名单失败!');
            }
            this.handleCancel();
        },response => {
            console.log("GET call in error", response);
            this.createBasicNotification('加入黑名单','加入黑名单请求提交失败，请检查网络并重试');
        });
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
        this.isQRVisible = false;
        this.isSLVisible = false;
    }

}