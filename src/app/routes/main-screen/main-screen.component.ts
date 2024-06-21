import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../Authorize/serviceAuthorize/api.service';
import { AuthService } from '../Authorize/serviceAuthorize/auth.service';
import { UserStoreService } from '../Authorize/serviceAuthorize/user-store.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
})
export class MainScreenComponent implements OnInit {
  isMenuOpen = false;
  userInfo: any = {};
  userIdFromToken: any;
  public fullName: any;
  public role!: number;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private userStore: UserStoreService,
    private toast: NgToastService,
    private cdr: ChangeDetectorRef,
    private HTTP: HttpClient,
    private router : Router ,
    private http : CommunityManagementService
  ) {}

  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe((val: any) => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
      this.cdr.detectChanges(); // Ensure change detection
    });
  
    this.userStore.getRoleFromStore().subscribe((val: any) => {
      const rollFromToken = this.auth.getRoleFromToken();
      this.role = val || rollFromToken;
      this.cdr.detectChanges(); // Ensure change detection
    });
  
    this.userStore.getUserIdFromStore().subscribe((val: any) => {
      const userIdFromToken = this.auth.getUserIdFromToken();
      this.userIdFromToken = val || userIdFromToken;
      this.getUser(this.userIdFromToken);
    });
  }
  

  async getUser(id: string) {
    try {
      const res = await this.HTTP.get(`http://localhost:43268/api/users/${id}`).toPromise();
      this.userInfo = res;
      console.log('User Info:', this.userInfo);
      this.cdr.detectChanges(); // Ensure change detection
    } catch (error) {
      console.error(error);
    }
  }
searchHandle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.http.updateSearch(input.value);
    // this.router.navigate(['home/search/all-search']);
  }
searchClick(){
  this.router.navigate(['home/search/all-search']);
}
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.cdr.detectChanges(); // Ensure change detection
  }

  logout() {
    this.auth.signOut();
    this.toast.success({
      detail: 'Success',
      summary: 'Bạn đã đăng xuất khỏi server của tôi',
      duration: 5000,
    });
    this.cdr.detectChanges(); // Ensure change detection
  }
}
