import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { constant } from 'src/app/utils/constant';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WordManagementService {

  currentWordBook: any;
  private courseUrl: string = 'http://localhost:43268/api/course/';
  baseUrl: string = 'http://localhost:43268/api/';
  CommunityUrl: string = 'http://localhost:43268/api/posts/';
  userUrl : string = 'http://localhost:43268/api/users'
  private readonly API_ROUTES = {
    getWord: (wordId : string) => `${this.baseUrl}/course/join/${wordId}`
  }
  constructor(private http: HttpClient) {}

  
  // getWordById(id: any) {
  //   return this.http.get(`${this.baseUrl}course/join/${id}`);
  // }
  // setCurrentWordBook(data: any): void {
  //   this.currentWordBook = data;
  //   this.saveDataCache(constant.CACHE_WORDBOOK_LABEL, data);
  // }
getAllUser(){
  return this.http.get(this.userUrl)
}
deleteUser(userId : any){
  return this.http.delete(this.userUrl+'/'+userId)
}
editUser(userId : any,post:any){
  return this.http.put(this.userUrl+'/change/'+userId,post)
}
  updateWordBook(id: any, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }
  createWordBook(data : any) {
    return this.http.post(this.baseUrl,data);
  
  }
  editWord(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}word/edit/${id}`, data);
  }
  deleteWordBook(id:any){
  return this.http.delete(this.baseUrl);
  }
  setCurrentListWord(data :any){
    this.currentWordBook = data;
    this.saveDataCache(constant.CACHE_WORDBOOK_LABEL, data);
  }
  saveDataCache(label: string, data: any) {
    localStorage.setItem(label, JSON.stringify(data));
  }

  noteWord(userId: string,wordId: string, wordNote: any) {
    const url = `http://localhost:43268/api/word/note/${userId}/${wordId}?wordNote=${wordNote}`;
    return this.http.put(url, null); 
  }
 getAllPost() {
    console.log("okk")
   return this.http.get(this.baseUrl);

  }
  getAllPostID(id : any){
    return this.http.get(this.baseUrl  +id) ;
  }
  handelSharePost(){
    
  }
  deletePost(id :any){
    return this.http.delete(this.baseUrl+id);
  }
  getAllComment(url: string){
    return this.http.get(this.baseUrl)
  }
  handelRating(courseId:any,rating :any){
    return this.http.put(this.baseUrl+courseId+'/rating', rating);
  }
  handelComment(userId:number,postId : number,content:any){
    return this.http.post(`${this.baseUrl}+ ${userId}+'/'+${postId}`, content)
  }
  updateCurrentWord(userId:any,courseId:any,currenWord : any){
    
    const url = `${this.courseUrl}currentWord/${userId}/${courseId}/${currenWord}`;
    return this.http.put(url,{});
  }
    updateProgress(userId:any,courseId:any,progress:any): Observable<any> {
    const url = `${this.courseUrl}progress/${userId}/${courseId}/${progress}`;
    return this.http.put(url,{});
  }
  learnedUpdate(userId:any,wordId:any){
    const url = `${this.baseUrl}word/learned/${userId}/${wordId}`;
    return this.http.put(url,{});
  }
  settingWordList(userId : string, courseId: string, wordNote :any, learnedStatus1:any) {
    const url = `${this.baseUrl}word/filter/${userId}/${courseId}`;
    let params = new URLSearchParams();

    if (wordNote) {
        params.append('wordNote', wordNote);
    }

    if (learnedStatus1) {
        params.append('learnedStatus1', learnedStatus1);
    }

    return this.http.get(`${url}?${params.toString()}`);
}
exportWordList(courseId :any): Observable<Blob>{
  const url = `${this.baseUrl}course/export/${courseId}`;
  return this.http.get(url, { responseType: 'blob' });
}
deleteCourse(courseId: string){
  const url = `${this.baseUrl}course/${courseId}`
  return this.http.delete(url);
}
trashCourse(userId:any, courseId: any){
const url = `${this.baseUrl}course/usercourse/${userId}/${courseId}`
return this.http.delete(url);
}
updatePoint(userId:any, courseId: any,points : number){
  const url = `${this.courseUrl}point/${userId}/${courseId}/${points}`
  return this.http.put(url,{})
}
createWord(courseId: string, formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}word/createWord/${courseId}`, formData);
}
}