import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent {
 listPost:any = [];
 userIdFromToken: any ;
  ngOnInit(): void {
    this.userIdFromToken = this.auth.getUserIdFromToken();
    this.getUser(this.userIdFromToken);
  }
  userInfo:any  
  constructor(private http : CommunityManagementService, private auth : AuthService,private HTTP : HttpClient) { }
  fetchData(id:any) :any {
    this.http.getAllPostID(id).subscribe((res :any) => {
      this.listPost = res; 
      console.log(this.listPost)
    })
  }
  async getUser(id: string) {
try {
  const res = await this.HTTP.get('http://localhost:43268/api/users/' + id).toPromise();
  this.userInfo = res;
  console.log(this.userInfo);
} catch (error) {
  console.error(error);
}

}
}
