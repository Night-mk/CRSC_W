import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-sign-management',
    templateUrl: './signManagement.component.html',
    styleUrls: ['./signManagement.component.less']
})
export class SignManagementComponent {

    courseSignData: any;
    hasSignData = true;
    isVisible = false;
    detailsDataSet: any;

    constructor(private http: _HttpClient) {
        //查询教师授课信息
        this.courseSignData = [{},{}];

        this.detailsDataSet = [
            {
                key: '1',
                name: 'John Brown',
                absence: 32,
                late: 50,
                leave: 12
            },
            {
                key: '2',
                name: 'John Brown',
                absence: 32,
                late: 50,
                leave: 12
            },
            {
                key: '3',
                name: 'John Brown',
                absence: 32,
                late: 50,
                leave: 12
            }
        ];
    }

    /**
     * 获取当前登陆教师id
     * @returns {any}
     */
    getTeacherId(){
        let teacherId;
        return teacherId;
    }

    /**
     * 获取该老师课程签到信息
     */
    getCourseSignMassage(){
        let teacherId = this.getTeacherId();
        let signMassageUrl = '';
        this.http.get(
            signMassageUrl,
            {params: teacherId}
        ).subscribe((data)=>{
            console.log(data);
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