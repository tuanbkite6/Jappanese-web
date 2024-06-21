import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {
 userId : any;
  constructor(
    private formBuilder: FormBuilder,
     private renderer: Renderer2,
     private http : CommunityManagementService,
     private authService: AuthService,
     private toast : NgToastService,
     private router : Router,
    ) {
     
    }
    ngOnInit(): void {
      this.getUserId();
    }
    async updateLevel(level: any){
      this.http.updateLevel(this.userId,level ).subscribe(
      (response) => {
        this.router.navigate(['firstlogin/category']);
        this.toast.success({
          detail: 'Thành công',
          summary: 'Đã cập nhật thông tin',
          duration: 5000,
        });
      },
      (error) => {
        this.toast.error({
          detail: 'Lỗi',
          summary: 'Có vấn đề',
          duration: 5000,
        });
      })
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
}
