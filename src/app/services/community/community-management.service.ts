import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunityManagementService {
  private searchSubject = new BehaviorSubject<string>('')
  currentSearch = this.searchSubject.asObservable();
  baseUrl: string = 'http://localhost:43268/api/Posts/';
  baseComment : string = 'http://localhost:43268/api/Comment/';
  userApi : string = 'http://localhost:43268/api/users/'
  classApi : string = 'http://localhost:43268/api/Class/';
  course : string = 'http://localhost:43268/api/course/';
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
  searchPosts(keyword: string): Observable<any> {
    return this.http.get(`${this.baseUrl}search`, { params: { keyword } });
  }
  filterTopRatedPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}filter/toprated`);
  }
  filterMostCommentedPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}filter/mostcommented`);
  }
  getMostImportedPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}filter/mostimported`);
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
  addReply(userId:any,commentId: string, reply: any): Observable<any> {
    return this.http.post(`${this.baseComment}reply/${userId}/${commentId}`, reply);
  }
  getReplies(commentId: any): Observable<any> {
    return this.http.get(`${this.baseComment}replies/${commentId}`);
  }
  sendComment(userId : any ,postId:any, body : any){
    return this.http.post(this.baseComment+userId+'/'+postId,body)
  }
  deleteComment(commentId : any ){
    return this.http.delete(`${this.baseUrl}comment/${commentId}`)
  }
  updateComment(commentId: string, updatedCommentText: string): Observable<any> {
    const payload = { updatedCommentText: updatedCommentText };
    return this.http.put(`${this.baseUrl}editcomment/${commentId}`, payload);
}

  updateLikeCount(commentId: string, isLiked: boolean): Observable<any> {
    return this.http.post(`${this.baseComment}like/${commentId}`, { isLiked : isLiked });
  }
  AddReply(commentId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reply/${commentId}`, {});
  }
  deleteReply(replyId: any): Observable<any> {
    return this.http.delete(`${this.baseComment}reply/${replyId}`);
  }
  editReply(replyId: any,replyText : any): Observable<any> {
    const payload  = {replyText : replyText}
    return this.http.put(`${this.baseComment}reply/${replyId}`, payload);
  }
  handelRating(postId:any,courseId:any,rating :any){
    return this.http.put(this.baseUrl+courseId+'/'+ postId +'/'+rating, '');
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
  searchCourse(keyword: any): Observable<any>{
    return this.http.get(`${this.course}search-courses`, { params: { keyword } });
  }
  searchUserCourse(userId:any,keyword: any): Observable<any>{
    return this.http.get(`${this.course}${userId}/search-usercourses`, { params: { keyword } });
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
getTeacherInfo(classId: any): Observable<any>{
  return this.http.get(`${this.classApi}teacherId/${classId}`)
}
addCourseInClass(classId: any,courseId : any): Observable<any>{
  return this.http.post(`${this.classApi}${classId}/addCourse/${courseId}`,{})
}
getInfoClass ( classId: any ): Observable<any>{
  return this.http.get(`${this.classApi}classDetails/${classId}`)
}
removeCourse(classId: any,courseId:any): Observable<any>{
  return this.http.delete(`${this.classApi}${classId}/removeCourse/${courseId}`)
}


}

