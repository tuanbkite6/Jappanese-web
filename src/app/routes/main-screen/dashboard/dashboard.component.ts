import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Authorize/serviceAuthorize/api.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public users:any = [];
  public listRankUsers = [];
  listMedal : any = [
    {
      rank : 1 ,
      image : "https://cdn-icons-png.flaticon.com/512/1910/1910476.png"

    },
    {
      rank : 2 ,
      image : "https://cdn-icons-png.flaticon.com/512/1910/1910479.png  "

    },
    {
      rank : 3,
      image : "https://cdn-icons-png.flaticon.com/512/2583/2583434.png"

    }
  ]
  listRankUser: any = [
 ];

  listAchievement: any = [
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/5455/5455914.png',
      name: '',
      date: '12/09/2022',
    },
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/1835/1835046.png',
      name: '',
      date: '14/09/2022',
    },
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3021/3021600.png',
      name: '',
      date: '16/09/2022',
    },
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/1834/1834988.png',
      name: '',
      date: '19/09/2022',
    },
  ];
  userId : any;
  screenHeight: number = 0;
  listLearnStatus: any;

  constructor(private api : ApiService, private authService : AuthService) {}

  async ngOnInit(): Promise<void>  {
    await this.getUserId();
    if (this.userId) {
      this.getLearnStatus()
    }
    this.fetchData()
    this.screenHeight = window.innerHeight;
    this.api.getUsers().subscribe((res :any) => {
      this.listRankUsers = res ;})
      console.log(this.listRankUser)
  }
  fetchData ( ): void {
    this.api.getRankingUsers().subscribe((res :any) => {
      this.listRankUser = res ;})
  }
  async getLearnStatus(){
    this.api.getLearnStatus(this.userId).subscribe((res :any) => {
      this.listLearnStatus = res ;})
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
