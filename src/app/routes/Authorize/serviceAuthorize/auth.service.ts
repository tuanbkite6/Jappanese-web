import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:43268/api/Account/';
  private usePayload: any;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.usePayload = this.decodeToken();
  }

  public authLogin(username: string, password: any): Observable<any> {
    console.log('AuthService: authLogin: ', username, password);
    const httpParams = new HttpParams();
    const payload = { username, password };
    return this.httpClient.post(this.baseUrl, payload, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  login(loginObj: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}Login`, loginObj).pipe(
      catchError(this.handleError),
      tap(response => {
        if (response && response.token) {
          this.storeToken(response.token);
          this.usePayload = this.decodeToken(); // Update the payload after storing the new token
        }
      })
    );
  }

  signUp(userObj: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}Register`, userObj);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  signOut(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string): void {
    localStorage.setItem('token', tokenValue);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('Error', errorMessage);
    return throwError(errorMessage);
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    if (token) {
      this.usePayload = jwtHelper.decodeToken(token);
      console.log(this.usePayload); // Debugging line
      return this.usePayload;
    }
    return null;
  }

  getfullNameFromToken(): string | undefined {
    if (this.usePayload) {
      return this.usePayload.sub;
    }
    return undefined;
  }

  getRoleFromToken(): string | undefined {
    if (this.usePayload) {
      return this.usePayload.typ;
    }
    return undefined;
  }

  getUserIdFromToken(): string | undefined {
    if (this.usePayload) {
      return this.usePayload.sid;
    }
    return undefined;
  }

  checkExistAccount(userObj: any): Observable<any> {
    console.log(userObj);
    return this.httpClient.post<any>(`${this.baseUrl}CheckUserNameExist`, userObj);
  }
  getUserInfo(userId: string): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:43268/api/users/${userId}`);
  }
}
