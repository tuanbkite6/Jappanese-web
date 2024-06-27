import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { constant } from 'src/app/utils/constant';

@Injectable({
  providedIn: 'root'
})
export class WordbookManagementService {
  getAllWordBookCreatedByUser(userIdFromToken: any) {
    throw new Error('Method not implemented.');
  }


  currentWordBook: any;
  currentClass:any;
  // baseUrl: string = 'https://632d24b2519d17fb53b8943d.mockapi.io/word-books';
  baseUrl: string = 'http://localhost:43268/api/course/';
  wordUrl: string = 'http://localhost:43268/api/word/'
  private speech = 'http://localhost:43268/TextToSpeech/'; 
  constructor(private http: HttpClient) {}
  getAllCourse(){
    return this.http.get(this.baseUrl)
  }
getAllWord(){
  return this.http.get(this.wordUrl);
}
  getAllWordbook() {
    return this.http.get(this.baseUrl);
  }
  getAllCourseByUserId(id:any){
    return this.http.get(`${this.baseUrl}${id}`)
  }
  getAllCourseByOtherUserId(id:any){
    return this.http.get(`${this.baseUrl}others/${id}`)
  }
  getCourseCreatedByUserId(userId:any){
     return this.http.get(`${this.baseUrl}created/${userId}`)

  }
  createWordByCourseId(idPost:any,data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}create/${idPost}`,data)
  }
  getWordbookById(userId: any,courseId: any): Observable<any>{
    return this.http.get(`${this.baseUrl}join/${userId}/${courseId}`);
  }
getCourseByStatus(userId: any,status:any): Observable<any>{
  return this.http.get(`${this.wordUrl}status/${userId}/${status}`);
}
  updateWordBook(id: any, data: any) {
    return this.http.put(`${this.baseUrl}${id}`, data);
  }
  createWordBook(id:any,data : any) {
    return this.http.post(`${this.baseUrl}${id}`,data);
  
  }
  deleteWordBook(id:any):Observable<any>{
  return this.http.delete(`${this.baseUrl}${id}`);

  }
  getCourseInfo(id: any,userId: string):Observable<any>{
    return this.http.get(`${this.baseUrl}info/${userId}/${id}`);
  }
  getCreatorInfo(id: any):Observable<any>{
    return this.http.get(`${this.baseUrl}course/userInfo/${id}`);
  }

  setCurrentWordBook(data: any): void {
    this.currentWordBook = data;
    this.saveDataCache(constant.CACHE_WORDBOOK_LABEL, data);
  }
  getWordById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}coursewords/${id}`);
  }
 setCurrentClass(data: any): void {
  this.currentClass = data;
  this.saveDataCache(constant.CACHE_CLASS_LABEL, data);
 }
  saveDataCache(label: string, data: any) {
    localStorage.setItem(label, JSON.stringify(data));
  }
  updateCourse(courseId: any,courseData : any):Observable<any>{
    const formattedCourseData = {
      ...courseData,
      category: JSON.stringify(courseData.category),
    };
    return this.http.put(`${this.baseUrl}course/${courseId}`, formattedCourseData)
  }
  updateWord(wordId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.wordUrl}edit/${wordId}`, formData);
  }
  deleteWord(courseId:any,wordId: string): Observable<any> {
    return this.http.delete(`${this.wordUrl}${courseId}/deleteWord/${wordId}`);
  }
  updateLearnTimeCourse(userId: string, wordId: string){
    return this.http.put(`${this.baseUrl}learnedAt/${userId}/${wordId}`,{})
  }
  noteCourse(userId: string, wordId: string,wordNote: any): Observable<any>{
    return this.http.put(`${this.baseUrl}update-course-note/${userId}/${wordId}/${wordNote}`,{})
  }
  getNoteCourse(userId: string){
return this.http.get(`${this.baseUrl}courseNote/${userId}`)
  }
  updateWordStatus(userId: string, wordId: string, wordStatus: any){
    return this.http.put(`${this.wordUrl}status/${userId}/${wordId}?wordStatus=${wordStatus}`,{})
  }
  rankingUser(courseId:any):any{
    return this.http.get(`${this.baseUrl}courseRank/${courseId}`)
  }
  speechAPi (text : any){
    const url = `${this.speech}GetSpeech?text=${encodeURIComponent(text)}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  getCourse(courseId:any):Observable<any>{
    return this.http.get(`${this.baseUrl}getinfo/${courseId}`)
  }
}

