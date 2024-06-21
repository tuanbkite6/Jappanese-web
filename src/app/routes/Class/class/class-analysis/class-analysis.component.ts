import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { staticPath } from 'src/app/utils/staticPath';
import { constant } from 'src/app/utils/constant';
import { AuthService } from 'src/app/routes/Authorize/serviceAuthorize/auth.service';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';


@Component({
  selector: 'app-class-analysis',
  templateUrl: './class-analysis.component.html',
  styleUrls: ['./class-analysis.component.css']
})
export class ClassAnalysisComponent {
  userId : any ;
  currentClass : any ;
  listRequest : any ;
    constructor(
      private router: Router,
      private wordbookService: WordbookManagementService,
      private wordService: WordManagementService,
      private http : CommunityManagementService,
      private message: NzMessageService,
      private toast: NgToastService,
      private auth : AuthService
    ) {}
    async ngOnInit(): Promise<void> {
      await this.getUserId();
      if (this.userId) {
        // this.getUserInfo(this.userId);
      }
      this.fetchData();
    
    }
    async fetchData(){
      const cachedClass = localStorage.getItem(constant.CACHE_CLASS_LABEL);
      if(cachedClass){
        this.currentClass = JSON.parse(cachedClass);
        console.log('class',this.currentClass)
      }
      this.http.getListRequest(this.currentClass).subscribe(
        (response) => {
         this.listRequest = response
          console.log('listReques', this.listRequest)
        },
        (error) => {
      this.listRequest = ''
          this.toast.warning({
            detail: 'Lỗi',
            summary: 'Không có yêu cầu tham gia nào ',
            duration: 2000,
          });
        })
        }
        async aprroveRequest(userId:any,status:any){
          if(this.currentClass){
            this.http.approveJoin(userId,this.currentClass,status).subscribe(
              (response) => {
                this.fetchData()
                this.toast.success({
                  detail: 'Thành công',
                  summary: 'Đã duyệt thành công',
                  duration: 2000,
                });
              },
              (error) => {
                this.toast.error({
                  detail: 'Lỗi',
                  summary: 'Approve thất bại',
                  duration: 2000,
                });
              }
            )
          }
        }
    async getUserId() {
      try {
        const userId = await this.auth.getUserIdFromToken();
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
