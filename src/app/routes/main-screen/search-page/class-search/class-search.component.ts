import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { staticPath } from 'src/app/utils/staticPath';

@Component({
  selector: 'app-class-search',
  templateUrl: './class-search.component.html',
  styleUrls: ['./class-search.component.css']
})
export class ClassSearchComponent implements OnInit{
  searchValue: any;
  searchData:any;
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
    this.http.searchClass(this.searchValue).subscribe(
      (response) => {
        this.searchData = response;
        
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
  onClickJoinClass(classId : any){
    this.router.navigate([`/${staticPath.CLASSREVIEW}`, { classId }]);
    this.wordbookService.setCurrentClass(classId);
  }
  ngOnDestroy() {
    // Hủy subscription khi component bị destroy
    this.searchSubscription.unsubscribe();
  }
}
