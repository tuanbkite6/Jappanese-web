import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private baseUrl: string = 'http://localhost:43268/api/users'
  constructor(private http : HttpClient) { }
  getUsers() {
    return this.http.get(this.baseUrl);
  }
  getRankingUsers() {
    return this.http.get(this.baseUrl + '/ranking');
  }
  getLearnStatus(userId:any) {
    return this.http.get(this.baseUrl + '/learning-stats/' + userId);
  }
}
