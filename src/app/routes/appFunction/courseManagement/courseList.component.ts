import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {map, tap} from 'rxjs/operators';
import {SimpleTableColumn, SimpleTableComponent} from '@delon/abc';
import {NzNotificationService} from 'ng-zorro-antd';
import {RouteService} from "./route.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';




@Component({
    selector: 'app-course-list',
    templateUrl: './courseList.component.html',
})
export class CourseListComponent implements OnInit {
    courseName:any;
    courseID:any;
    loading = false ;

    //课程表展示数据
    courseDetailData: any[] = [];
    //接口请求url
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        getAllCourseUrl: this.urlTemplate+'Curriculum/read/',
        editCourseUrl: this.urlTemplate+'Curriculum/edit/',
        deleteCourseUrl:this.urlTemplate+'Curriculum/delete/',
    };
    columns: SimpleTableColumn[] = [
        { title: '', index: 'key', type: 'checkbox' },
        { title: '课程名称', index: 'courseName' },
        { title: '课程编号', index: 'courseID' },
        {title:'课程学时', index:'courseTime'},
        {
            title: '操作',
            buttons: [
                { text: '删除', click: (item: any) => this.deleteCourse(`${item.course_id}`) },
            ]
        }
    ];


    constructor(private http: _HttpClient,
                private notification: NzNotificationService,
                public route:RouteService,
                private fb: FormBuilder,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
    }

    ngOnInit(): void {

    }
    getCourseData() {
        this.loading = true;
        //发起请求
        let url = this.requestUrlList.getAllCourseUrl+'/uid/'+this.tokenService.get().uid+'/gid/'+this.tokenService.get().gid;

        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                this.courseDetailData = [];
                //处理相关数据
                for(let course_detail of data['data']){
                    // let term_data = '';
                    let courseData = {
                        courseName:course_detail.course_name,
                        courseID:course_detail.course_id,
                        courseTime:course_detail.period,
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
    createBasicNotification(title, content): void {
        this.notification.blank( title, content);
    }
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

    AddCourse(){
        ++this.route.step;
    }



}
