import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
})
export class AdminUserComponent implements OnInit {
  listUser: any;
  UserName: any;
  UserPassWord: any;
  userForm = new FormGroup({
    userName: new FormControl(''),
    userPassword: new FormControl(''),
  });
  isEdit: any = true;
  constructor(
    private http: HttpClient,
    private word: WordManagementService,
    private toast: NgToastService
  ) {}
  ngOnInit(): void {
    this.fetchData();
    console.log(1);
  }

 fetchData() {
    var response =  this.word.getAllUser().subscribe((res: any) => {
      this.listUser = res;
    });
  }

  handleOpenPut(idUser: any): any {
    this.isEdit = this.isEdit === idUser ? null : idUser;
  }

  deleteUser(userId: any) {
    if (confirm('Bạn có chắc muốn xóa người dùng này không?')) {
      this.word.deleteUser(userId).subscribe({
        next: (res) => {
          this.toast.info({
            detail: 'Info',
            summary: 'Đã xóa người dùng này',
            duration: 2000,
          });
          this.fetchData();
        },
        error: (err) => {
          this.toast.info({
            detail: 'Info',
            summary: 'Chưa xóa được tài khoản',
            duration: 2000,
          });
        }
      });
    }
  }
  

  async putUserInfor(userId: any) {
    this.isEdit = this.isEdit === userId ? null : userId;
    try {
      await this.word.editUser(userId, this.userForm.value).toPromise();
      this.toast.info({
        detail: 'Info',
        summary: 'Đã sửa thông tin người dùng',
        duration: 2000,
      });
    } catch (error) {
      this.toast.warning({
        detail: 'Warning',
        summary: 'Có vấn đề khi sửa tài khoản ',
        duration: 2000,
      });
    }
    this.toast.info({
      detail: 'Info',
      summary: 'Đã sửa thông tin người dùng này',
      duration: 2000,
    });

    this.fetchData();
  }
  onClickEdit() {}
}
