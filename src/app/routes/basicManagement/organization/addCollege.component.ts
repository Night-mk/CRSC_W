import{Component, Inject,OnInit,ViewChild} from "@angular/core";
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {OrganizationRouteService} from "./organizationRoute.service";

@Component({
    selector: 'app-add-college',
    templateUrl: './addCollege.component.html'
})

export class AddCollegeComponent {

    form: FormGroup;
    submitting=false;
    select_school: any;
    loading=false;
    isVisible = false;
    schoolList:any;
    level:any;
    pid:any;
    // course_id:any

    //接口链接
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        getAllCourseUrl: this.urlTemplate+'Organization/read/',
        editCourseUrl: this.urlTemplate+'Organization/edit/'
    };

    //添加提交信息（特殊数据）
    AddCourseList = {
        school: null,
        //选择的课程id
        college: null,
        profession: null,
        courseID:null,
    };

    constructor(private http: _HttpClient,private fb: FormBuilder,
                private msg: NzMessageService,
                public Oroute:OrganizationRouteService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private notification: NzNotificationService,) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            // school: [ null, Validators.compose([Validators.required]) ],
            college: [ null, Validators.compose([Validators.required]) ],
            // profession: [ null, Validators.compose([Validators.required]) ],
        });
    }

    /**
     * 获取form数据
     * @returns {AbstractControl}
     */
    // get school(){ return this.form.controls['school'];}
    get college(){ return this.form.controls['college'];}
    // get profession(){ return this.form.controls['profession'];}

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

    getInformation() {
        this.loading = true;
        //发起请求
        let url = this.requestUrlList.getAllCourseUrl+'/uid/'+this.tokenService.get().uid+'/gid/'+this.tokenService.get().gid;

        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                // this.courseDetailData = [];
                // //处理相关数据
                // for(let course_detail of data['data']){
                //     // let term_data = '';
                //     let courseData = {
                        course_id:data.id;
                //     };
                    this.search({course_id:data.id});
                //     // this.courseDetailData.push(courseData);
                // }
                // this.loading = false;
                // // console.log(this.courseDetailData);
            }else{
                this.createBasicNotification('查询授课安排','查询失败');
            }
            this.loading = false;
        },response=>{
            console.log("POST call in error", response);
        });

    }

    search(courseID){
        this.loading = true;
        //发起请求
        let url = this.requestUrlList.getAllCourseUrl+'/id/'+courseID;

        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            this.level =data.level++;
            this.pid =data.id;
            console.log(this.level);
            console.log(this.pid);
            this.loading = false;
        },response=>{
            console.log("POST call in error", response);
        });
    }

    addCollege(){
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            const college=this.AddCourseList.college;
            let url = this.requestUrlList.editCourseUrl+
                'title/'+this.AddCourseList.college+'/level/'+this.level+'/pid/'+this.pid;
            console.log(url);
            if(college=="")
            {
                this.createBasicNotification('添加失败', '请补充信息');
            }
            else {
                this.http.get(
                    url
                ).subscribe((data) => {

                    if (data['status'] == 0) {
                        this.createBasicNotification('添加课程', '添加成功');
                        this.Oroute.step = 0;
                    } else {
                        console.log('add course error');

                    }
                }, response => {
                    console.log("GET call in error", response);
                });
            }


        }, 1000 * 2);
    }
    createBasicNotification(title, content): void {
        this.notification.blank( title, content);
    }

    prev(){
        this.Oroute.step=0;
    }
}
