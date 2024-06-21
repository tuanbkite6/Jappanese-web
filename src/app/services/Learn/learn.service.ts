import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LearnService {

  private courseUrl: string = 'http://localhost:43268/api/Class/';
  
  constructor(private http: HttpClient) {}

  // Create Class
  createClass(teacherId: string, newClass: any): Observable<any> {
    return this.http.post(`${this.courseUrl}createClass/${teacherId}`, newClass);
  }

  // Get Enrolled Classes
  getEnrolledClasses(studentId: string): Observable<any> {
    return this.http.get(`${this.courseUrl}enrolled/${studentId}`);
  }

  // Get Created Classes
  getCreatedClasses(userId: string): Observable<any> {
    return this.http.get(`${this.courseUrl}created/${userId}`);
  }

  // Delete Class
  deleteClass(classId: string): Observable<any> {
    return this.http.delete(`${this.courseUrl}deleteClass/${classId}`);
  }

  // Add Member
  addMember(classId: string, studentId: string, member: any): Observable<any> {
    return this.http.post(`${this.courseUrl}addMember/${classId}/${studentId}`, member);
  }

  // Remove Member
  removeMember(classId: string, studentId: string): Observable<any> {
    return this.http.delete(`${this.courseUrl}removeMember/${classId}/${studentId}`);
  }

  // Add Course to Class
  addCourseToClass(classId: string, courseId: string): Observable<any> {
    return this.http.post(`${this.courseUrl}${classId}/addCourse/${courseId}`, {});
  }

  // Remove Course from Class
  removeCourseFromClass(classId: string, courseId: string): Observable<any> {
    return this.http.delete(`${this.courseUrl}${classId}/removeCourse/${courseId}`);
  }

  // Request Enrollment
  requestEnrollment(classId: string, studentId: string): Observable<any> {
    return this.http.post(`${this.courseUrl}requestEnrollment/${classId}/${studentId}`, {});
  }

  // Approve Enrollment
  approveEnrollment(classId: string, studentId: string, approvalRequest: any): Observable<any> {
    return this.http.post(`${this.courseUrl}approveEnrollment/${classId}/${studentId}`, approvalRequest);
  }
}
