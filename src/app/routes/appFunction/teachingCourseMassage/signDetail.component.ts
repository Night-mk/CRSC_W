import {Component, OnInit, ViewChild} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SkipService } from './skip.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SimpleTableColumn, SimpleTableComponent} from '@delon/abc';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-sign-detail',
    templateUrl: './signDetail.component.html'
})
export class SignDetailComponent{
    loading = false;
    isVisible = false;
    CourseName: any;

    gutter: any;
    count: any;
    //行数
    col: any;
    //列数
    row: any;
    //座位二维数组
    seatArray: any;
    //存储全部学生的签到数据
    allSeatData: any;
    //每个模态框显示的座位信息
    seatDetailData = {
        name: null,
        number: null,
        signon: null,
        signout: null
    };


    //接口请求url
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        getSignDetailUrl: this.urlTemplate+'StudentPeriod/read'
    };

    constructor(private http: _HttpClient,
                public skip: SkipService,
                public msg: NzMessageService) {
        this.gutter = this.skip.gutter;
        this.count = this.skip.counter;
        this.col = parseInt(this.skip.col);
        this.row = parseInt(this.skip.row);
        //初始化座位数据
        this.seatArray = [];
        for(let i=0; i<this.col; i++){
            this.seatArray[i] = [];
            for(let j=0; j<this.row; j++){
                let seatData = {
                    seat_No: (i+1)+'-'+(j+1),
                    name: null,
                    index: null,
                    number: null
                };
                this.seatArray[i][j] = seatData;
            }
        }
        //首次刷新
        this.getSignDetail();
    }

    /**
     * 获取签到信息
     */
    getSignDetail(){
        this.loading = true;
        let url = this.requestUrlList.getSignDetailUrl+'/period_id/'+this.skip.period_id;
        this.http.get(
            url
        ).subscribe((data)=>{
            if(data['status']==0){
                console.log(data['data']);
                this.allSeatData = [];
                this.allSeatData = data['data'];
                this.seatDetailData = this.allSeatData[0];
                // console.log(this.seatDetailData);
                //更新seatData的值
                data['data'].forEach((seat_data, index)=>{
                    let col = parseInt(seat_data.x)-1;
                    let row = parseInt(seat_data.y)-1;
                    //更新姓名和id
                    this.seatArray[col][row].name = seat_data.name;
                    this.seatArray[col][row].index = index;
                    this.seatArray[col][row].number = seat_data.number;
                });

            }
            this.loading = false;
        },response=>{
            console.log('GET error');
        });
    }

    /**
     * 模态框显示详细信息
     * @param seat_index
     */
    showSeatDetailModel(seat_index){
        this.seatDetailData = this.allSeatData[seat_index];
        console.log(this.seatDetailData);
        this.seatDetailData.signon = this.skip.signOnNumber2String(this.seatDetailData.signon);
        this.seatDetailData.signout = this.skip.signOutNumber2String(this.seatDetailData.signout);
        this.showModal();
    }


    /**
     * 返回上一页
     */
    prev(){
        --this.skip.step;
    }

    //-----------------------------------------------------------
    // 模态框服务
    //-----------------------------------------------------------

    showModal(): void {
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