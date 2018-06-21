import { Injectable } from '@angular/core';

@Injectable()
export class SkipService {

    /**
     * 页码数
     * @type {number}
     */
    step: 0 | 1 | 2 | 3 = 0;

    /**
     * 学年
     */
    term_year: any;

    /**
     * 学期
     */
    term : any;

    /**
     * 开始周
     */
    start_week: any;

    /**
     * 结束周
     */
    end_week: any;

    /**
     * 星期
     */
    week: any;

    /**
     * 授课时段
     */
    time: any;

    /**
     * 授课教室
     */
    course_address: any;

    /**
     * 授课id：cid
     * 用于从search跳转向courseDetail传递数据
     */
    cid: any;

    /**
     * 课表id：period_id
     * 用于从courseDetail跳转向signDetail传递数据
     */
    period_id: any;

    /**
     * 课程签到详情每行状况
     */
    gutter: any;
    counter: any;
    col: any;
    row: any;


    again() {
        this.gutter = 8;
        this.counter = 8;
        this.col = 0;
        this.row = 0;

        this.step = 0;
        this.term_year = [
            '2010-2011',
            '2011-2012',
            '2012-2013',
            '2013-2014',
            '2014-2015',
            '2015-2016',
            '2016-2017',
            '2017-2018',
            '2018-2019',
            '2019-2020',
            '2020-2021',
            '2021-2022'
        ];
        this.term = [
            {
                term_name:'第一学期',
                term_id: 1
            },
            {
                term_name:'第二学期',
                term_id: 2
            }
        ];
        this.start_week = [
            '1','2','3','4','5','6','7','8','9','10',
            '11','12','13','14','15','16','17','18','19','20'
        ];
        this.end_week = this.start_week;
        this.week = [
            {
                week_name:'星期一',
                week_id: 1
            },
            {
                week_name:'星期二',
                week_id: 2
            },
            {
                week_name:'星期三',
                week_id: 1
            },
            {
                week_name:'星期四',
                week_id: 1
            },
            {
                week_name:'星期五',
                week_id: 1
            },
            {
                week_name:'星期六',
                week_id: 1
            },
            {
                week_name:'星期七',
                week_id: 1
            }
        ];
        this.time = [
            {
                title: '1-2',
                id: 1
            },{
                title: '3-4',
                id: 2
            },{
                title: '5-6',
                id: 3
            },{
                title: '7-8',
                id: 4
            },{
                title: '9-10-11',
                id: 5
            }
        ];
    }

    /**
     * 转换签到函数
     * @param num
     * @returns {string}
     */
    signOnNumber2String(num){
        switch (num){
            case '1': return '准时';
            case '2': return '迟到';
            default : return '暂无签到信息';
        }
    }

    /**
     * 转换签退函数
     * @param num
     * @returns {string}
     */
    signOutNumber2String(num){
        switch (num){
            case '1': return '准时';
            case '2': return '早退';
            default : return '暂无签到信息';
        }
    }

    constructor() {
        this.again();
    }
}
