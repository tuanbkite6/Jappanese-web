import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/routes/Authorize/serviceAuthorize/auth.service';
import { LearnService } from 'src/app/services/Learn/learn.service';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { staticPath } from 'src/app/utils/staticPath';

@Component({
  selector: 'app-class-dashboard',
  templateUrl: './class-dashboard.component.html',
  styleUrls: ['./class-dashboard.component.css']
})
export class ClassDashboardComponent implements OnInit { 
  visible: boolean = false;
  classForm : FormGroup;
  myClassData : any;
  createdClassData : any; 
  userId: any;
constructor(
  private fb : FormBuilder,
  private http : LearnService,
  private authService : AuthService,
  private message : NzMessageService,
  private router : Router,
  private toast : NgToastService,
  private modal : NzModalService,
  private wordbookService : WordbookManagementService
){
  this.classForm = this.fb.group({
    className: ['', Validators.required], // Tên lớp, bắt buộc nhập
    description: ['', Validators.required], // Mô tả, bắt buộc nhập
    level: [null, Validators.required] // Cấp độ, bắt buộc chọn
  });
}
ngOnInit(): void {
  this.getUserId().then( () => {
    this.getCreatedClassData()
    this.getMyClassData();
  })
}
async getCreatedClassData() {
  try {
    this.http.getCreatedClasses(this.userId).subscribe(
      (data: any) => {
        this.createdClassData = data;
        console.log('data', this.createdClassData);
      },
      (error) => {
        console.error('Error fetching created classes', error);
      }
    );
  } catch (err) {
    console.error('Error in getCreatedClassData method', err);
  }
}

async getUserId() {
  try {
    const userId = await this.authService.getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found');
    } else {
      this.userId = userId;
    }
  } catch (error) {
    console.error('Error getting User ID', error);
  }
}
async getMyClassData(){
  try {
    this.http.getEnrolledClasses(this.userId).subscribe(
      (data: any) => {
        this.myClassData = data;
        console.log('data', this.myClassData);
      },
      (error) => {
        console.error('Error fetching created classes', error);
      }
    );
  } catch (err) {
    console.error('Error in getCreatedClassData method', err);
  }

}
open(): void {
  this.visible = true;
}

close(): void {
  this.visible = false;
}
get f() {
  return this.classForm.controls;
}
onClickClassDetail(classId :any){
  this.router.navigate([`/${staticPath.CLASS}`,{classId}]);
  this.wordbookService.setCurrentClass(classId);
}
async onClickDelete(classId: any,event: Event){
  event.stopPropagation();
  this.modal.confirm({
    nzTitle: 'Bạn có chắc muốn xóa lớp này không ?',
    nzContent:
      '<b style="color: red;">Lớp sẽ bị xóa hoàn toàn khỏi hệ thống</b>',
    nzOkText: 'Xóa lớp',
    nzOkType: 'primary',
    nzOkDanger: true,
    nzOnOk: async () => {
      //lỗi xóa chưa bị nhảy vào error
      if (classId == null) {
        this.toast.error({
          detail: 'Lỗi',
          summary: 'Không tìm thấy lớp',
          duration: 5000,
        })
      } else {
        const response = await this.http
          .deleteClass(classId)
          .subscribe(
            (response) => {
              this.getCreatedClassData()
              this.toast.success({
                detail: 'Thành công',
                summary: 'Lớp đã được xoá',
                duration: 5000,
              });
            },
            (error) => {
              this.toast.error({
                detail: 'Lỗi',
                summary: 'Chưa xóa được lớp',
                duration: 5000,
              });
            }
          );
      }
    },
    nzCancelText: 'Hủy',
    nzOnCancel: () => console.log('Cancel'),
  });
}
async onClickSubmit() {
  if (this.classForm.valid) {


    try {
      const response: any = await this.http.createClass(this.userId, this.classForm.value).toPromise();
      const classId = response.classId;
      this.message.loading('Khóa học đang được thêm');
      this.visible = false;
      this.router.navigate([`/${staticPath.CLASS}`,{classId}]);
      // this.wordbookService.setCurrentWordBook(newCourseId);
      this.getCreatedClassData(); 
      this.toast.success({
        detail: 'Success',
        summary: 'Đã tạo học phần',
        duration: 5000,
      });
    } catch (error) {
      this.toast.warning({
        detail: 'Warning',
        summary: 'Chưa tạo thành công',
        duration: 5000,
      });
    }
  }else{
    this.toast.warning({
      detail: 'Warning',
      summary: 'Hãy nhập đủ các ô input',
      duration: 5000,
    });
  }
}


}
