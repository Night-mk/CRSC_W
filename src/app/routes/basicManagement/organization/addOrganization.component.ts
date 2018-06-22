import{Component, Inject,OnInit,ViewChild} from "@angular/core";
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {OrganizationRouteService} from "./organizationRoute.service";

@Component({
    selector: 'app-add-organization',
    templateUrl: './addOrganization.component.html'
})

export class AddOrganizationComponent {

    form: FormGroup;
    submitting=false;
    select_school: any;
    loading=false;
    isVisible = false;
    schoolList:any;
    level=1;
    pid=0;

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
    };




    constructor(private http: _HttpClient,private fb: FormBuilder,
                private msg: NzMessageService,
                public Oroute:OrganizationRouteService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private notification: NzNotificationService,) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            school: [ null, Validators.compose([Validators.required]) ],
            college: [ null, Validators.compose([Validators.required]) ],
            profession: [ null, Validators.compose([Validators.required]) ],
        });
    }

    /**
     * 获取form数据
     * @returns {AbstractControl}
     */
    get school(){ return this.form.controls['school'];}
    get college(){ return this.form.controls['college'];}
    get profession(){ return this.form.controls['profession'];}

    // createNotification(type: string): void {
    //     this.notification.create(type, '添加成功',
    //         '恭喜添加了新的课程');
    // }

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

    // addSchool(){
    //     this.level++;
    //     console.log(this.level);
    // }
    //
    // addCollege(){
    //     this.level++;
    //     console.log(this.level);
    // }
    //
    // addProfession(){
    //     this.level++;
    //     console.log(this.level);
    //
    // }

    addInformation(){
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            // this.pid=this.Oroute.Opid;
            const school=this.AddCourseList.school;
            const college=this.AddCourseList.college;
            const profession=this.AddCourseList.profession;
            let url = this.requestUrlList.editCourseUrl+
                'title/'+this.AddCourseList.school+'/level/'+this.level+'/pid/'+this.pid;

            console.log(url);
            if(school==''||college==""||profession=="")
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
