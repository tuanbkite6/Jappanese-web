import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { staticPath } from 'src/app/utils/staticPath';
@Component({
  selector: 'app-course-search',
  templateUrl: './course-search.component.html',
  styleUrls: ['./course-search.component.css']
})
export class CourseSearchComponent {
  searchValue: any;
  searchData:any;
  wordReviewData:any;
  courseName : any;
  courseId : any;
  searchSubscription: Subscription | any;
  constructor(
    private http: CommunityManagementService,
    private toast : NgToastService,
    private router: Router,
    private wordbookService : WordbookManagementService
  ) { }

  ngOnInit() {
    this.searchSubscription = this.http.currentSearch.subscribe(search => {
      this.searchValue = search;
      this.performSearch();
    });
  }
  performSearch() {
    // Logic tìm kiếm theo giá trị searchValue
    console.log('Perform search with value:', this.searchValue);
    this.http.searchCourse(this.searchValue).subscribe(
      (response) => {
        this.searchData = response;
        console.log(this.searchData)
        this.onClickReview(response[0].courseId)
      },
      (error) => {
        this.searchData = ''
        this.toast.error({
          detail: 'Lỗi',
          summary: 'Không có dữ liệu',
          duration: 5000,
        });
      })

  }
  onClickReview(courseId:any){
    this.wordbookService.getCourse(courseId).subscribe(
      (response) => {
        this.courseName = response.courseName;
        this.courseId = response.courseId;
        console.log(response)
      },
      (error) => {
        this.searchData = ''
        this.toast.error({
          detail: 'Lỗi',
          summary: 'Không có dữ liệu',
          duration: 5000,
        });
      })
    this.wordbookService.getWordById(courseId).subscribe(
      (response) => {
        this.wordReviewData = response;
        console.log(this.wordReviewData)
      },
      (error) => {
        this.searchData = ''
        this.toast.error({
          detail: 'Lỗi',
          summary: 'Không có dữ liệu',
          duration: 5000,
        });
      })
  }
  onClickLearn(id : any){
    this.wordbookService.setCurrentWordBook(id)
this.router.navigate([`/${staticPath.CLASSCOURSE}`]);
  }
  ngOnDestroy() {
    // Hủy subscription khi component bị destroy
    this.searchSubscription.unsubscribe();
  }
}
