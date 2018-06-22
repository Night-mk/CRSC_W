import{Component, Inject,OnInit,ViewChild} from "@angular/core";
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {OrganizationRouteService} from "./organizationRoute.service";
import {SimpleTableComponent} from "../../delon/simple-table/simple-table.component";
import {SimpleTableColumn} from "@delon/abc";

@Component({
    selector: 'app-organization-list',
    templateUrl: './organizationList.component.html'
})
export class OrganizationListComponent {

    form: FormGroup;
    submitting=false;
    select_school: any;
    loading=false;
    isVisible = false;
    schoolList:any;

    //接口链接
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        getAllCourseUrl: this.urlTemplate+'Organization/read/',
        editCourseUrl: this.urlTemplate+'organization/edit/',
        deleteCoureseUrl:this.urlTemplate+'Organization/delete/'
    };

    //添加提交信息（特殊数据）
    AddCourseList = {
        courseName: null,
        //选择的课程id
        courseID: null,
        courseTime: null,
        chooseSchoolID: null,
        college: null,
        profession: null,
        chooseLevel:null,
    };
    @ViewChild('st') st: SimpleTableComponent;
    columns: SimpleTableColumn[] = [
        { title: '', index: 'key', type: 'checkbox' },
        { title: '学校/学院/专业', index: 'organization_id' },
        {
            title: '操作',
            buttons: [
                { text: '删除', click: (item: any) => this.deleteCourse(`${item.course_id}`) },
                { text: '添加', click: (item: any) => this.addCollege(`${item.course_id}`,`${item.course_level}`) },
                // { text: '添加', click: (item: any) => this.getCollege() },
            ]
        }
    ];
    courseDetailData: any[] = [];
    constructor(private http: _HttpClient,private fb: FormBuilder,
                private msg: NzMessageService,
                private Oroute:OrganizationRouteService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private notification: NzNotificationService,){

    }

    addCollege(courseID,courseLevel){
        this.Oroute.step=2;
        this.loading = true;
        //发起请求
        let url = this.requestUrlList.editCourseUrl+'/id/'+courseID+'/level/'+courseLevel;

        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
<<<<<<< HEAD
            if(data['status']==1){

                this.courseDetailData=[];
                //处理相关数据
                    this.Oroute.Opid=courseID;
                    this.Oroute.Olevel=courseLevel;
                    // this.Oroute.levle=data['data'].level;
                    console.log(this.Oroute.Opid);
                    console.log(this.Oroute.Olevel);
                    // this.courseDetailData.push(courseData);
                this.loading = false;
=======
            if(data['status']==0){
                // this.Oroute.Opid=data.pid;
                console.log(this.Oroute.Opid);
                // this.courseDetailData = [];
                // //处理相关数据
                // for(let course_detail of data['data']){
                //     // let term_data = '';
                //     let courseData = {
                //         organization_id:course_detail.title,
                //         course_id:course_detail.id,
                //
                //     };
                //     this.courseDetailData.push(courseData);
                // }
                // this.loading = false;
>>>>>>> 6229085f1131f493feac2954fcdfbcc69bc168f6
                // console.log(this.courseDetailData);
            }else{
                this.createBasicNotification('查询授课安排','查询失败');
            }
            this.loading = false;
        },response=>{
            console.log("POST call in error", response);
        });

    }

    getCollege(){
        this.Oroute.step=2;
    }

    getSchoolData() {
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
                        organization_id:course_detail.title,
                        course_id:course_detail.id,
                        course_level:course_detail.level,

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

    // getSchool(){
    //     let url = this.requestUrlList.getAllCourseUrl+
    //         'uid/'+this.tokenService.get().uid+'/gid/'+this.tokenService.get().gid;
    //     this.http.get(
    //         url
    //     ).subscribe((data)=>{
    //         if(data['status']==0){
    //             let allcourse = data['data'];
    //             this.schoolList = allcourse;
    //             console.log(allcourse);
    //             //打开模态框
    //             this.loading = false;
    //             this.showModal();
    //         }else{
    //             this.createBasicNotification('获取学校','获取成功');
    //             console.log('get all course error');
    //         }
    //     },response=>{
    //         console.log("GET call in error", response);
    //     });
    // }
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
    // chooseSchool(course_data){
    //     //获取course_id并设置系统课程id
    //     this.AddCourseList.chooseSchoolID= course_data.id;
    //     this.AddCourseList.chooseLevel=course_data.level;
    //     //改变input框的值
    //     // this.changeFormValue('course_name', course_data.course_name);
    //     this.form.patchValue({school: course_data.title});
    //     console.log(course_data);
    //     //关闭模态框
    //     this.handleCancel();
    // }
    createBasicNotification(title, content): void {
        this.notification.blank( title, content);
    }

    AddSchool(){
        ++this.Oroute.step;
    }
    deleteCourse(courseId){
        let url = this.requestUrlList.deleteCoureseUrl+'/id/'+courseId;
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
}
