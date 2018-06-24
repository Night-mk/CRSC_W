import {Component, Inject, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {RouterService} from '../../router.service';

@Component({
    selector: 'passport-forget-password',
    templateUrl: './forgetPassword.component.html',
    styleUrls: [ '../register/register.component.less' ],
    providers: [RouterService]
})
export class ForgetPasswordComponent {

    form: FormGroup;
    error = '';

    //接口请求url
    urlTemplate = this.rootRouter.rootRouter+'CRSS/index.php/';
    requestUrlList = {
        forgetPasswordUrl : this.urlTemplate+'Login/forget_password'
    };

    constructor(fb: FormBuilder,
                private router: Router,
                public msg: NzMessageService,
                public http: _HttpClient,
                private notification: NzNotificationService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private rootRouter: RouterService) {
        this.form = fb.group({
            mail: [null, [Validators.email]]
        });
    }

    get mail() { return this.form.controls.mail; }

    /**
     * 发送邮箱密码
     */
    forgetPassword() {
        //发送邮箱验证码
        let email = this.mail.value;
        let url = this.requestUrlList.forgetPasswordUrl+'/name/'+email.slice(0,-7);
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                //显示发送成功
                this.createBasicNotification('发送新密码','新密码发送成功！');
                console.log("send success");
            }else{
                this.createBasicNotification('发送新密码','新密码发送失败！');
            }
        }, response => {
            console.log("GET call in error", response);
            this.createBasicNotification('发送新密码','发送请求提交失败，请检查网络并重试');
        });
        this.router.navigate(['/passport/login']);
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
