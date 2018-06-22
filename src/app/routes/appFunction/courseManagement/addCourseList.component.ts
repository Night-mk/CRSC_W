import{Component, Inject,OnInit,ViewChild} from "@angular/core";
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {RouteService} from './route.service';



@Component({
    selector: 'app-add-course-list',
    templateUrl: './addCourseList.component.html',
})

export class AddCourseListComponent implements OnInit {
    form: FormGroup;
    loading=false;
    isVisible = false;
    schoolList:any;

    //接口链接
    urlTemplate = 'CRSS/index.php/';
    requestUrlList = {
        getAllCourseUrl: this.urlTemplate+'Organization/read/',
        editCourseUrl: this.urlTemplate+'Curriculum/edit/'
    };

    //添加提交信息（特殊数据）
    AddCourseList = {
        courseName: null,
        //选择的课程id
        courseID: null,
        courseTime: null,
        chooseSchoolID: null,
        college: null,
        profession: null,
        chooseLevel:null,
    };




    constructor(private http: _HttpClient,private fb: FormBuilder,
                private msg: NzMessageService,
                public route:RouteService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private notification: NzNotificationService,) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            courseName: [ null, Validators.compose([Validators.required]) ],
            courseID: [ null, Validators.compose([Validators.required])],
            courseTime: [ null, Validators.compose([Validators.required]) ],
            school: [ null, Validators.compose([Validators.required]) ],
            college: [ null, Validators.compose([Validators.required]) ],
            profession: [ null, Validators.compose([Validators.required]) ],
        });
    }

    /**
     * 获取form数据
     * @returns {AbstractControl}
     */
    get courseName(){ return this.form.controls['courseName'];}
    get courseID(){ return this.form.controls['courseID'];}
    get courseTime(){ return this.form.controls['courseTime'];}

    // createNotification(type: string): void {
    //     this.notification.create(type, '添加成功',
    //         '恭喜添加了新的课程');
    // }

    getSchool(){
        let url = this.requestUrlList.getAllCourseUrl+
            'uid/'+this.tokenService.get().uid+'/gid/'+this.tokenService.get().gid;
        this.http.get(
            url
        ).subscribe((data)=>{
            if(data['status']==0){
                let allcourse = data['data'];
                this.schoolList = allcourse;
                console.log(allcourse);
                //打开模态框
                this.loading = false;
                this.showModal();
            }else{
                this.createBasicNotification('获取学校','获取成功');
                console.log('get all course error');
            }
        },response=>{
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

    chooseSchool(course_data){
        //获取course_id并设置系统课程id
        this.AddCourseList.chooseSchoolID= course_data.id;
        this.AddCourseList.chooseLevel=course_data.level;
        //改变input框的值
        // this.changeFormValue('course_name', course_data.course_name);
        this.form.patchValue({school: course_data.title});
        console.log(course_data);
        //关闭模态框
        this.handleCancel();
    }


    addCourse(){
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            const Time=this.AddCourseList.courseTime;
            const ID=this.AddCourseList.courseID;
            const name=this.AddCourseList.courseName;
            let url = this.requestUrlList.editCourseUrl+
                'period/'+this.AddCourseList.courseTime+'/unit/'+this.AddCourseList.chooseSchoolID+
                '/course_id/'+this.AddCourseList.courseID+'/course_name/'+this.AddCourseList.courseName
            console.log(url);
            if(Time==''||ID==""||name=="")
            {
                this.createBasicNotification('添加失败', '请补充信息');
            }
            else {
                this.http.get(
                    url
                ).subscribe((data) => {

                    if (data['status'] == 0) {
                        this.createBasicNotification('添加课程', '添加成功');
                        this.route.step = 0;
                    } else {
                        console.log('add course error');

                    }
                }, response => {
                    console.log("GET call in error", response);
                });
            }


        }, 1000 * 2);
    }
    createBasicNotification(title, content): void {
        this.notification.blank( title, content);
    }
    prev(){
        this.route.step=0;
    }

    // submit() {
    //     for (const i in this.form.controls) {
    //         this.form.controls[ i ].markAsDirty();
    //         this.form.controls[ i ].updateValueAndValidity();
    //     }
    //     if (this.form.invalid) return;
    //     this.submitting = true;
    //     setTimeout(() => {
    //         this.submitting = false;
    //         this.msg.success(`提交成功`);
    //     }, 1000);
    // }


}
