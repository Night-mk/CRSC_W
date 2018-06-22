import {Component, Inject, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
    selector: 'app-time-table',
    templateUrl: './timeTable.component.html'
})
export class TimeTableComponent implements OnInit{

    form: FormGroup;
    loading = false;
    hasTimeData = false;

    //编辑作息时间信息
    editTimeTableMessage = {
        title: null,
        start_time: null,
        end_time: null,
        school_name: null,
        perior_of_time: null,
        period: null
    };

    //展示用作息时间表数据
    timeTableData: any;

    //接口请求url
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        editTimeTableUrl : this.urlTemplate+'TimeTable/edit',
        readTimeTableUrl : this.urlTemplate+'TimeTable/read',
        deleteTimeTableUrl : this.urlTemplate+'TimeTable/delete',
    };

    constructor(private http: _HttpClient,
                private notification: NzNotificationService,
                private fb: FormBuilder,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService){
        this.editTimeTableMessage.school_name = this.tokenService.get().school;
        this.getTimeTable();
    }
    ngOnInit(){
        this.form = this.fb.group({
            title: [null, Validators.compose([Validators.required])],
            start_time: [null, Validators.compose([Validators.required])],
            end_time: [null, Validators.compose([Validators.required])],
            perior_of_time: [null, Validators.compose([Validators.required])],
            period: [null, [Validators.required]]
        });
    }

    /**
     * 查询获取作息时间表
     */
    getTimeTable(){
        let url = this.requestUrlList.readTimeTableUrl+'/oid/'+this.tokenService.get().oid;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                this.timeTableData = data['data'];
                console.log(this.timeTableData);
                if(this.timeTableData==[] || this.timeTableData==null){
                    this.hasTimeData = false;
                }else{
                    this.hasTimeData = true;
                }
                // this.createBasicNotification('查询作息时间表','查询成功');
            }else{
                this.createBasicNotification('查询作息时间表','查询失败');
            }
        },response => {
            console.log("GET call in error", response);
            this.createBasicNotification('查询作息时间表','查询请求提交失败，请检查网络并重试');
        });
    }

    /**
     * 编辑作息时间表
     */
    editTimeTable(){
        let url = this.requestUrlList.editTimeTableUrl+'/title/'+this.editTimeTableMessage.title+
            '/start_time/'+this.editTimeTableMessage.start_time+
            '/end_time/'+this.editTimeTableMessage.end_time+
            '/oid/'+this.tokenService.get().oid+
            '/perior_of_time/'+this.editTimeTableMessage.perior_of_time+
            '/period/'+this.editTimeTableMessage.period;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            if(data['status']==0){
                this.createBasicNotification('编辑作息时间表','编辑成功');
                this.editTimeTableMessage = {
                    title: null,
                    start_time: null,
                    end_time: null,
                    school_name: null,
                    perior_of_time: null,
                    period: null
                };
            }else{
                this.createBasicNotification('编辑作息时间表','编辑失败');
            }
        },response => {
            console.log("GET call in error", response);
            this.createBasicNotification('编辑作息时间表','编辑请求提交失败，请检查网络并重试');
        });
    }

    /**
     *  删除作息时间表
     */
    deleteTimeTable(timeId){
        let url = this.requestUrlList.deleteTimeTableUrl+'/id/'+timeId;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                this.createBasicNotification('删除作息时间表','删除成功');
            }else{
                this.createBasicNotification('删除作息时间表','删除失败');
            }
        },response => {
            console.log("GET call in error", response);
            this.createBasicNotification('删除作息时间表','删除请求提交失败，请检查网络并重试');
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

}