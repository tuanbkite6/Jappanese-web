import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunityManagementService {
  private searchSubject = new BehaviorSubject<string>('')
  currentSearch = this.searchSubject.asObservable();
  baseUrl: string = 'http://localhost:43268/api/posts/';
  baseComment : string = 'http://localhost:43268/api/comment/';
  userApi : string = 'http://localhost:43268/api/users/'
  classApi : string = 'http://localhost:43268/api/Class/';
  constructor(private http : HttpClient) { }
  updateSearch(search: string) {
    this.searchSubject.next(search);
  }
  getAllPost() {
    console.log("okk")
   return this.http.get(this.baseUrl);

  }
  getAllPostID(id : any){
    return this.http.get(this.baseUrl  +id) ;
  }
  getAllCourseByUserId(userId : any){
    return this.http.get(this.baseUrl + userId);
  }
 
    // return this.http.post<any>(this.baseUrl+userId,body)
  
  handelSharePost(userId: string, postData: FormData){
  

    return this.http.post(`${this.baseUrl}${userId}`, postData)
  }

  deletePost(id :any){
    return this.http.delete(this.baseUrl+id);
  }
  getAllComment(url: any){
    return this.http.get(this.baseComment+url)
  }
  sendComment(userId : any ,postId:any, body : any){
    return this.http.post(this.baseComment+userId+'/'+postId,body)
  }
  handelRating(courseId:any,rating :any){
    return this.http.put(this.baseUrl+courseId+'/'+rating, '');
  }
  handelComment(userId:number,postId : number,content:any){
    return this.http.post(`${this.baseUrl}+ ${userId}+'/'+${postId}`, content)
  }
  importCourse(userId:any,postId:any){
    return this.http.post<any>(this.baseUrl+userId+'/'+postId,'');
  }
  updateAvatar(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`http://localhost:43268/api/users/${userId}/avatar`, formData);
  }
  updateInfo (userId: string, data:any):Observable<any>{
    return this.http.put(`${this.userApi}info/${userId}`,data);
  }
  updateLevel (userId:string, level: any):Observable<any>{
return this.http.put(`${this.userApi}level/${userId}/${level}`,{})
  }
  updateCategories(userId: string, categories: string[]): Observable<any> {
    return this.http.put(`${this.userApi}userCategory/${userId}`, { UserCategory: categories  });
  }
  searchClass(className: string): Observable<any> {
    return this.http.get(`${this.classApi}search`, { params: { className } });
  }
  requestJoin(userId: any, classId:any): Observable<any>{
    return this.http.post(`${this.classApi}requestEnrollment/${classId}/${userId}`,{})
  }

  approveJoin(userId: any, classId:any,status:any): Observable<any>{
    const body = { enrollmentStatus: status };
    return this.http.post(`${this.classApi}approveEnrollment/${classId}/${userId}`,body)
  }
getListRequest(classId: any): Observable<any>{
  return this.http.get(`${this.classApi}enrollmentRequests/${classId}`)
}
getEnrroledClasses(classId: any): Observable<any>{
  return this.http.get(`${this.classApi}activeStudents/${classId}`)
}
getCourseInClass (classId: any): Observable<any>{
  return this.http.get(`${this.classApi}coursesInClass/${classId}`)
}
addCourseInClass(classId: any,courseId : any): Observable<any>{
  return this.http.post(`${this.classApi}${classId}/addCourse/${courseId}`,{})
}
getInfoClass ( classId: any ): Observable<any>{
  return this.http.get(`${this.classApi}classDetails/${classId}`)
}
}

