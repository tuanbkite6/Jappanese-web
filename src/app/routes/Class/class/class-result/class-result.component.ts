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
  selector: 'app-class-result',
  templateUrl: './class-result.component.html',
  styleUrls: ['./class-result.component.css'],
})
export class ClassResultComponent {
  constructor(
    private router: Router,
    private wordService: WordManagementService,
    private http: CommunityManagementService,
    private message: NzMessageService,
    private toast: NgToastService,
    private auth: AuthService,
    private course: WordbookManagementService
  ) {}
  userId: any;
  isIcon = true;
  isCourseInfo = false;
  selectCourse: any;
  currentClass: any;
  courseData: any;
  isVisible = false;
  listCourse : any;
  async ngOnInit(): Promise<void> {
    await this.getUserId();
    await this.fetchData();
    this.getAllCourseById();
  }
  async fetchData() {
    const cachedClass = localStorage.getItem(constant.CACHE_CLASS_LABEL);
    if (cachedClass) {
      this.currentClass = JSON.parse(cachedClass);
      console.log('class', this.currentClass);
    }
    this.http.getCourseInClass(this.currentClass).subscribe(
      (response) => {
        this.courseData = response;
        console.log('listReques', this.courseData);
      },
      (error) => {
        this.courseData = '';
        this.toast.warning({
          detail: 'Thông tin',
          summary: 'Không có khóa học nào trong lớp ',
          duration: 2000,
        });
      }
    );
  }
  getAllCourseById(): any {
    this.course.getAllCourseByUserId(this.userId).subscribe((res) => {
      this.listCourse = res;
    });
  }
  closeModal(): any {
    if (this.isVisible) {
      this.isVisible = false;
    }
  }
  async onClickCourse(courseId: any) {
    this.closeModal();
    // this.courseId.setValue() = courseId ;
    this.course
      .getCourseInfo(courseId, this.userId)
      .subscribe((res) => {
        this.selectCourse = res;
        console.log(this.selectCourse);
      });
  if(this.selectCourse){
    this.http.addCourseInClass(this.currentClass,this.selectCourse.courseId).
    subscribe(
      (response) => {
        this.fetchData()
        this.toast.info({
          detail: 'Thông tin',
          summary: 'Đã thêm học phần ',
          duration: 2000,
        });
      },
      (error) => {
        
        this.toast.warning({
          detail: 'Thông tin',
          summary: 'Học phần đã có trong lớp ',
          duration: 2000,
        });
      }
   ) }
  
    this.isIcon = false;
    this.isCourseInfo = true;
  }
  openModal(): any {
    this.isVisible = true;
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
