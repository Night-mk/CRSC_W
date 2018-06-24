import {Component, OnInit, ViewChild} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SkipService } from './skip.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SimpleTableColumn, SimpleTableComponent} from '@delon/abc';
import {NzNotificationService} from 'ng-zorro-antd';
import {RouterService} from '../../router.service';

@Component({
    selector: 'app-course-detail',
    templateUrl: './courseDetail.component.html'
})
export class CourseDetailComponent{
    loading = false;

    //选择的课程名称
    CourseName: string;
    courseTableData: any[] = [];

    //接口请求url
    urlTemplate = this.rootRouter.rootRouter+'CRSS/index.php/';
    requestUrlList = {
        getCourseTableDataUrl: this.urlTemplate+'CoursePeriod/read',
        getSignDataUrl: this.urlTemplate+'CoursePeriod/read',
    };

    @ViewChild('st') st: SimpleTableComponent;
    columns: SimpleTableColumn[] = [
        { title: '', index: 'key', type: 'checkbox' },
        { title: '周次', index: 'teaching_week' },
        { title: '星期', index: 'week' },
        { title: '课程时段', index: 'time'},
        { title: '授课地点', index: 'class_room'},
        { title: '授课教师', index: 'teacher'},
        { title: '学时', index: 'period'},
        {
            title: '操作',
            buttons: [
                { text: '签到详情', click: (item: any) =>  this.openSignDetailPage(`${item.id}`,`${item.col}`,`${item.row}`) }
            ]
        }
    ];

    constructor(private http: _HttpClient,
                public skip: SkipService,
                private notification: NzNotificationService,
                private rootRouter: RouterService) {
        //预获取课程表数据
        this.getCourseTableData();
    }

    /**
     * 获取课程表数据
     */
    getCourseTableData(){
        this.loading = true;
        let url = this.requestUrlList.getCourseTableDataUrl+'/cid/'+this.skip.cid;
        console.log(url);
        this.http.get(
            url
        ).subscribe((data)=>{
            console.log(data);
            if(data['status']==0){
                console.log(data['data']);
                //处理数据
                this.courseTableData = [];
                //1、赋值课程名称
                let courseTableDataList = data['data'];
                this.CourseName = courseTableDataList[0].course_name;
                //2、for循环处理特殊数据
                for(let course_table_data of courseTableDataList){
                    course_table_data.week = this.changeWeek2String(course_table_data.week);
                    this.courseTableData.push(course_table_data);
                }
                console.log(this.courseTableData);
            }else{
                this.createBasicNotification('查询失败','未安排课程');
                console.log('get course table error');
            }
            this.loading = false;
        },response => {
            console.log("GET call in error", response);
            this.createBasicNotification('查询失败','请检查网络');
            this.loading = false;
        });
    }

    /**
     * 将星期数字转换为字符串
     * @param weekNum
     * @returns {string}
     */
    changeWeek2String(weekNum){
        switch (weekNum){
            case 1: return this.skip.week[0].week_name;
            case 2: return this.skip.week[1].week_name;
            case 3: return this.skip.week[2].week_name;
            case 4: return this.skip.week[3].week_name;
            case 5: return this.skip.week[4].week_name;
            case 6: return this.skip.week[5].week_name;
            case 7: return this.skip.week[6].week_name;
            default: return this.skip.week[0].week_name;
        }

    }

    /**
     * 打开签到详情页面
     */
    openSignDetailPage(courseId, col, row){
        this.skip.period_id = courseId;
        this.skip.col = col;
        this.skip.row = row;
        this.skip.step++;
    }

    /**
     * 返回上一页
     */
    prev(){
        this.skip.step=0;
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