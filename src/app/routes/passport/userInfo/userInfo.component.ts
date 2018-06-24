import {Component, Inject, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {forEach} from '@angular/router/src/utils/collection';
import {RouterService} from '../../router.service';

@Component({
    selector: 'passport-userInfo',
    templateUrl: './userInfo.component.html',
    styleUrls: [ '../register/register.component.less' ],
    providers: [RouterService]
})
export class UserInfoComponent {

    form: FormGroup;
    loading = false;
    error = '';

    //接口请求url
    urlTemplate = this.rootRouter.rootRouter+'CRSS/index.php/';
    requestUrlList = {
        getOrganizationUrl : this.urlTemplate+'Organization/read',
        editUserInfoUrl : this.urlTemplate+'UserInfo/edit'
    };

    group_id = [
        {
            name: '教师',
            gid: 28
        }, {
            name: '学生',
            gid: 29
        }
    ];
    organizationData = [];

    //需要提交的信息
    userInfoData = {
        uid: null,
        gid: null,
        name: null,
        oid: null,
        number: null,
        phone: null
    };

    constructor(fb: FormBuilder,
                private router: Router,
                public msg: NzMessageService,
                public http: _HttpClient,
                private notification: NzNotificationService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private rootRouter: RouterService) {
        this.form = fb.group({
            name: [null, Validators.compose([Validators.required])],
            number: [null, Validators.compose([Validators.required])],
            gid: [null, Validators.compose([Validators.required])],
            oid: [null, Validators.compose([Validators.required])],
            phone: [null, Validators.compose([Validators.required])]
        });

        //获取学校信息
        this.getOrganization();
    }

    get name() { return this.form.controls.name; }
    get number() { return this.form.controls.number; }
    get gid() { return this.form.controls.gid; }
    get oid() { return this.form.controls.oid; }
    get phone() { return this.form.controls.phone; }

    /**
     * 获取学校信息
     */
    getOrganization(){
        let url = this.requestUrlList.getOrganizationUrl+'/type/'+1;
        this.http.get(
            url
        ).subscribe((data)=>{

            if(data['status']==0){
                console.log(data['data']);
                for(let item of data['data']){
                    if(item.level==0){
                        let organization = {
                            title: item.title,
                            oid: item.id
                        };
                        this.organizationData.push(organization);
                    }
                }
                console.log(this.organizationData);
                // this.createBasicNotification('发送验证码','验证码发送成功！');
                console.log("get organization success");
            }else{
                // this.createBasicNotification('发送验证码','验证码发送失败！');
            }
        }, response => {
            console.log("GET call in error", response);
            // this.createBasicNotification('发送验证码','发送请求提交失败，请检查网络并重试');
        });
    }

    /**
     * 编辑用户信息
     */
    editUserInfo(){
        let url = this.requestUrlList.editUserInfoUrl+'/uid/'+this.tokenService.get().uid+
            '/gid/'+this.userInfoData.gid+'/name/'+this.name.value+
            '/oid/'+this.userInfoData.oid+'/number/'+this.number.value+
            '/phone/'+this.phone.value;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            if(data['status']==0){
                console.log(data['data']);
                this.createBasicNotification('提交详细信息','提交详细信息成功！');
                this.router.navigate(['/passport/login']);
                console.log("get organization success");
            }else{
                this.createBasicNotification('提交详细信息','提交详细信息失败！');
                this.router.navigate(['/passport/userInfo']);
            }
        }, response => {
            console.log("GET call in error", response);
            this.createBasicNotification('提交详细信息','提交请求失败，请检查网络并重试');
            this.router.navigate(['/passport/userInfo']);
        });
    }
    /**
     * 简单提示框
     * @param title
     * @param content
     */
    createBasicNotification(title, content): void {
        this.notification.blank( title, content);
    }
}
