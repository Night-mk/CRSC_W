import {Component, Inject, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {Md5} from 'ts-md5';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';

@Component({
    selector: 'passport-register',
    templateUrl: './register.component.html',
    styleUrls: [ './register.component.less' ]
})
export class UserRegisterComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    type = 0;
    loading = false;
    visible = false;
    status = 'pool';
    progress = 0;
    passwordProgressMap = {
        ok: 'success',
        pass: 'normal',
        pool: 'exception'
    };

    //接口请求url
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        getCaptchaUrl : this.urlTemplate+'Register/send_mail',
        registerUrl : this.urlTemplate+'Register/register'
    };

    constructor(fb: FormBuilder,
                private router: Router,
                public msg: NzMessageService,
                public http: _HttpClient,
                private notification: NzNotificationService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
        this.form = fb.group({
            mail: [null, [Validators.email]],
            password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
            confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEquar]],
            mobilePrefix: [ '+86' ],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]]
        });
    }

    static checkPassword(control: FormControl) {
        if (!control) return null;
        const self: any = this;
        self.visible = !!control.value;
        if (control.value && control.value.length > 9)
            self.status = 'ok';
        else if (control.value && control.value.length > 5)
            self.status = 'pass';
        else
            self.status = 'pool';

        if (self.visible) self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }

    static passwordEquar(control: FormControl) {
        if (!control || !control.parent) return null;
        if (control.value !== control.parent.get('password').value) {
            return { equar: true };
        }
        return null;
    }

    // region: fields

    get mail() { return this.form.controls.mail; }
    get password() { return this.form.controls.password; }
    get confirm() { return this.form.controls.confirm; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    // region: get captcha

    count = 0;
    interval$: any;

    /**
     * 获取邮箱验证码
     */
    getCaptcha() {
        this.tokenService.set({
            token: ''
        });
        //发送邮箱验证码
        let email = this.mail.value;
        let url = this.requestUrlList.getCaptchaUrl+'/name/'+email.slice(0,-7);
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                //显示发送成功
                this.createBasicNotification('发送验证码','验证码发送成功！');
                console.log("send success");
            }else{
                this.createBasicNotification('发送验证码','验证码发送失败！'+data['msg']);
            }
        }, response => {
            console.log("GET call in error", response);
            this.createBasicNotification('发送验证码','发送请求提交失败，请检查网络并重试');
        });

        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    /**
     * 注册
     */
    submit() {
        this.error = '';
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        //if (this.form.invalid) return;
        // mock http
        this.loading = true;
        let passwdMd5 = Md5.hashStr(this.password.value);
        let url = this.requestUrlList.registerUrl+'/name/'+this.mail.value.slice(0,-7)
                    +'/pwd/'+passwdMd5+'/captcha/'+this.captcha.value;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                //显示发送成功
                this.createBasicNotification('注册','注册成功！');
                console.log("send success");
            }else{
                this.createBasicNotification('注册','注册失败！'+data['msg']);
                this.router.navigate(['/passport/register']);
            }
        }, response => {
            console.log("GET call in error", response);
            this.createBasicNotification('注册','注册请求提交失败，请检查网络并重试');
        });
        this.loading = false;
        this.router.navigate(['/passport/login']);
    }

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
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
