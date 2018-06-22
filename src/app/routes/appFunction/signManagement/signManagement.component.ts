import {Component, Inject} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';

@Component({
    selector: 'app-sign-management',
    templateUrl: './signManagement.component.html',
    styleUrls: ['./signManagement.component.less']
})
export class SignManagementComponent {
    
    hasSignData = false;
    isVisible = false;
    courseSignData: any;
    detailsDataSet: any;

    //接口请求url
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        readCourseUrl : this.urlTemplate+'Statistics/read',
        getSignDetailUrl: this.urlTemplate+'Statistics/getuser'
    };

    constructor(private http: _HttpClient,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
        //查询教师授课信息
        this.courseSignData = [{},{}];

        // this.detailsDataSet = [
        //     {
        //         key: '1',
        //         name: 'John Brown',
        //         absence: 32,
        //         late: 50,
        //         leave: 12
        //     },
        //     {
        //         key: '2',
        //         name: 'John Brown',
        //         absence: 32,
        //         late: 50,
        //         leave: 12
        //     },
        //     {
        //         key: '3',
        //         name: 'John Brown',
        //         absence: 32,
        //         late: 50,
        //         leave: 12
        //     }
        // ];
        this.getCourseSignMassage();
    }

    /**
     * 获取该老师课程签到信息
     */
    getCourseSignMassage(){
        let url = this.requestUrlList.readCourseUrl+'/uid/'+this.tokenService.get().uid;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            if(data['status']==0){
                this.courseSignData = data['data'];
                console.log(this.courseSignData);
                if(this.courseSignData==[] || this.courseSignData==null){
                    this.hasSignData = false;
                }else{
                    this.hasSignData = true;
                }
                console.log("get course sign massage succeed");
            }else{
                console.log("get course sign massage in error");
            }
            this.handleCancel();
        },response => {
            console.log("GET call in error", response);
        });
    }

    /**
     * 打开统计详情模态框
     * @param courseId
     */
    openSignDetailsModal(courseId){
        this.showModal();
        this.getSignDetails(courseId);
    }

    /**
     * 获取统计好的签到详情
     * @param courseId
     */
    getSignDetails(courseId){
        let url = this.requestUrlList.getSignDetailUrl+'/iid/'+ courseId;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            if(data['status']==0){
                this.detailsDataSet = data['data'];
                console.log(this.detailsDataSet);
                console.log("get course sign details succeed");
            }else{
                console.log("get course sign details in error");
            }
        },response => {
            console.log("GET call in error", response);
        });
    }



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
}