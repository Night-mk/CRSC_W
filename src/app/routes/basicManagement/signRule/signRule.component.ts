import{Component, Inject,OnInit,ViewChild} from "@angular/core";
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';

@Component({
    selector: 'app-sign-rule',
    templateUrl: './signRule.component.html'
})
export class SignRuleComponent {
    form: FormGroup;
    loading=false;
    isVisible = false;
    schoolList:any;
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        getSignOnRuleUrl: this.urlTemplate+'SignonRule/read/',
        editSignOnRuleUrl: this.urlTemplate+'SignonRule/edit/'
    };
    AddCourseList = {
        signOnTime:null,
        signOutTime:null,
        distance:null,
        signID:null,
        signOid:null,
    };

    constructor(private http: _HttpClient,private fb: FormBuilder,
                private msg: NzMessageService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private notification: NzNotificationService,){

    }
    ngOnInit(): void {
        this.form = this.fb.group({
            signOnTime: [ null, Validators.compose([Validators.required]) ],
            signOutTime: [ null, Validators.compose([Validators.required])],
            distance: [ null, Validators.compose([Validators.required]) ],
        });
    }
    get signOnTime(){ return this.form.controls['signOnTime'];}
    get signOutTime(){ return this.form.controls['signOutTime'];}
    get distance(){ return this.form.controls['distance'];}

    getSignRule(){
        this.loading=true;
        let url=this.requestUrlList.getSignOnRuleUrl+'/uid/'+this.tokenService.get().uid+'/gid/'+this.tokenService.get().gid;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                // this.AddCourseList.signID=data['data'].uid;
                // this.AddCourseList.signOid=data['data'].gid;
                for( let course_detail of data['data']){
                    this.AddCourseList.signID=course_detail.id;
                    this.AddCourseList.signOid=course_detail.oid;
                }
                console.log(this.AddCourseList.signID);
                console.log(this.AddCourseList.signOid);
            }else{
                this.createBasicNotification('查询失败','查询失败');
            }
            this.loading = false;
        },response=>{
            console.log("POST call in error", response);
        });
    }

    addSignRule(){
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            const signOnTime=this.AddCourseList.signOnTime;
            const signOutTime=this.AddCourseList.signOutTime;
            const distance=this.AddCourseList.distance;
            let url = this.requestUrlList.editSignOnRuleUrl+'/id/'+this.AddCourseList.signID+
                '/oid/'+this.AddCourseList.signOid+ '/signon_time/'+this.AddCourseList.signOnTime+
                '/signout_time/'+this.AddCourseList.signOutTime+ '/distance/'+this.AddCourseList.distance;
            console.log(url);
            if(signOnTime==''||signOutTime==""||distance=="")
            {
                this.createBasicNotification('添加失败', '请补充信息');
            }
            else {
                this.http.get(
                    url
                ).subscribe((data) => {

                    if (data['status'] == 0) {
                        this.createBasicNotification('添加成功', '添加成功');
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

}
