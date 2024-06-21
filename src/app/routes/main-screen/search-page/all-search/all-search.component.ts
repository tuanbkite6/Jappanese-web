import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';

@Component({
  selector: 'app-all-search',
  templateUrl: './all-search.component.html',
  styleUrls: ['./all-search.component.css']
})
export class AllSearchComponent implements OnInit{
  searchValue: any;
  searchSubscription: Subscription | any;
  constructor(private http: CommunityManagementService) { }

  ngOnInit() {
    this.searchSubscription = this.http.currentSearch.subscribe(search => {
      this.searchValue = search;
      this.performSearch();
    });
  }
  performSearch() {
    // Logic tìm kiếm theo giá trị searchValue
    console.log('Perform search with value:', this.searchValue);
  }

  ngOnDestroy() {
    // Hủy subscription khi component bị destroy
    this.searchSubscription.unsubscribe();
  }
}
