import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css'],
})
export class PersonalInformationComponent implements OnInit {
  listPost: any = [];
  userIdFromToken: any;
  userInfo: any;
  selectedFile: File | null = null;
  imageMin: File | null = null;
  constructor(
    private http: CommunityManagementService,
    private auth: AuthService,
    private HTTP: HttpClient,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userIdFromToken = this.auth.getUserIdFromToken();
    this.getUser(this.userIdFromToken);
    this.fetchData(this.userIdFromToken);
  }

  fetchData(id: any): void {
    this.http.getAllPostID(id).subscribe((res: any) => {
      this.listPost = res;
      console.log('Posts:', this.listPost);
    });
  }

  async getUser(id: string) {
    try {
      const res = await this.HTTP.get(
        'http://localhost:43268/api/users/' + id
      ).toPromise();
      this.userInfo = res;
      console.log('User Info:', this.userInfo);
      this.cdr.detectChanges(); // Trigger change detection
    } catch (error) {
      console.error(error);
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.imageMin = null ;
    const fr = new FileReader();
    fr.onload = (event: any) =>{
      this.imageMin = event.target.result;
    };
    if(this.selectedFile){
      fr.readAsDataURL(this.selectedFile)
    }
    if (this.selectedFile) {
      this.http.updateAvatar(this.userIdFromToken, this.selectedFile).subscribe(
        (res) => {
          console.log('Upload success', res);
          this.getUser(this.userIdFromToken); 
          window.location.reload// Refresh user info to get the new avatar URL
        },
        (err) => {
          console.error('Upload error', err);
        }
      );
    }
  }
  }

