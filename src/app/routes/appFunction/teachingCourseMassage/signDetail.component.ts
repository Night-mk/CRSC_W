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
    CourseName: any;

    //接口请求url
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        getSignDetailUrl: this.urlTemplate+'StudentPeriod/read'
    };

    constructor(private http: _HttpClient,
                public skip: SkipService,
                public msg: NzMessageService) {

    }

    getSignDetail(){
        this.loading = true;
        let url = this.requestUrlList.getSignDetailUrl+'/period_id/'+this.skip.period_id;
        this.http.get(
            url
        ).subscribe((data)=>{
            if(data['status']==0){
                console.log(data['data']);
            }
        },response=>{

        });
    }

    /**
     * 返回上一页
     */
    prev(){
        --this.skip.step;
    }
}