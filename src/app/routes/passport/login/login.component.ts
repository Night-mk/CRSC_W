import {_HttpClient, SettingsService} from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { SocialService, SocialOpenType, TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core/startup/startup.service';
import { Md5 } from "ts-md5/dist/md5";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {RouterService} from '../../router.service';

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.less' ],
    providers: [ SocialService , RouterService]
})
export class UserLoginComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    type = 0;
    loading = false;

    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private settingsService: SettingsService,
        private socialService: SocialService,
        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
        private startupSrv: StartupService,
        private http: _HttpClient,
        private rootRouter: RouterService,
        private notification: NzNotificationService
    ) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(5)]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
        modalSrv.closeAll();
    }

    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    getRandom(num):string{
        let random = Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,num-1));
        return random.toString();
    }

    // endregion

    submit() {
        this.error = '';
        if (this.type === 0) {
            this.userName.markAsDirty();
            this.userName.updateValueAndValidity();
            this.password.markAsDirty();
            this.password.updateValueAndValidity();
            if (this.userName.invalid || this.password.invalid) return;
        } else {
            this.mobile.markAsDirty();
            this.mobile.updateValueAndValidity();
            this.captcha.markAsDirty();
            this.captcha.updateValueAndValidity();
            if (this.mobile.invalid || this.captcha.invalid) return;
        }
        // mock http
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            // 清空路由复用信息
            this.reuseTabService.clear();
            // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
            // this.startupSrv.load().then(() => this.router.navigate(['/']));
            // 否则直接跳转
            let passwdMd5 = Md5.hashStr(this.password.value);
            let loginUrl = this.rootRouter.rootRouter+'CRSS/index.php/Login/login/type/1/name/'+this.userName.value+'/pwd/'+passwdMd5;
            console.log(loginUrl+" "+this.userName.value+" "+passwdMd5 );

            //get登陆请求
            this.http.get(
                loginUrl
            ).subscribe((data) => {
                    console.log(data);
                    if(data['status'] == 0){
                        console.log('go to login page POST');
                        let resData = data['data'];
                        //若没有gid信息，跳转填写相信信息页面
                        let tokenNumber = this.getRandom(9);
                        console.log(resData.gid);
                        //没有个人信息
                        if(resData.gid.length==0 || resData.gid==undefined){
                            this.tokenService.set({
                                token: tokenNumber,
                                time: +new Date,
                                uid: resData.id
                            });
                            this.router.navigate(['passport/userInfo']);
                        }else{
                            // 设置Token信息
                            this.tokenService.set({
                                token: tokenNumber,
                                name: this.userName.value,
                                email: this.userName.value,
                                time: +new Date,
                                uid: resData.id,
                                gid: resData.gid[0].group_id,
                                oid: resData.gid[0].oid,
                                school: resData.gid[0].oname
                            });
                            console.log(this.tokenService.get());
                            this.createBasicNotification('登陆',data['msg']);
                            this.router.navigate(['main/']);
                        }
                    }else{
                        this.createBasicNotification('登陆',data['msg']);
                        this.router.navigate(['passport/login']);
                    }
                },
                response => {
                    console.log("GET call in error", response);
                }
            );
        }, 1000);
    }

    // region: social

    open(type: string, openType: SocialOpenType = 'href') {
        let url = ``;
        let callback = ``;
        if (environment.production)
            callback = 'https://cipchk.github.io/ng-alain/callback/' + type;
        else
            callback = 'http://localhost:4200/callback/' + type;
        switch (type) {
            case 'auth0':
                url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'github':
                url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'weibo':
                url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
                break;
        }
        if (openType === 'window') {
            this.socialService.login(url, '/', {
                type: 'window'
            }).subscribe(res => {
                if (res) {
                    this.settingsService.setUser(res);
                    this.router.navigateByUrl('/');
                }
            });
        } else {
            this.socialService.login(url, '/', {
                type: 'href'
            });
        }
    }

    // endregion

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
