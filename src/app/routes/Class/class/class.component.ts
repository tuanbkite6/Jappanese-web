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
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {
constructor( private router: Router,
  private wordbookService: WordbookManagementService,
  private wordService: WordManagementService,
  private http : CommunityManagementService,
  private message: NzMessageService,
  private toast: NgToastService,
  private auth : AuthService) { }
  userId : any ;
  currentClass : any ;
  isRole : any = true ;
  courseData : any ;
  async ngOnInit(): Promise<void> {
  await this.getUserId();
  if (this.userId) {
    // this.getUserInfo(this.userId);
  }
  this.fetchData();
}
  handleIndexChange(e: any): void {
    this.router.navigate(['/class   ', e]);
    console.log(e);
    
  }
  async fetchData(){
    const cachedClass = localStorage.getItem(constant.CACHE_CLASS_LABEL);
    if(cachedClass){
      this.currentClass = JSON.parse(cachedClass);
      console.log('class',this.currentClass)
    }
    this.http.getCourseInClass(this.currentClass).subscribe(
      (response) => {
       this.courseData = response
        console.log('listReques', this.courseData)
      },
      (error) => {
    this.courseData = ''

      })
      }
      checkUserRole(creatorInfo: any) {
        if (this.userId == creatorInfo) {
          this.isRole = true;
        } else {
          this.isRole = false;
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
