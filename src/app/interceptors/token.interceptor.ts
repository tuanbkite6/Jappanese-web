import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../routes/Authorize/serviceAuthorize/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService, private router : Router,private toast : NgToastService) {}

  intercept(request : HttpRequest<unknown>, next: HttpHandler ):Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();
    if(myToken){
      request = request.clone({
        setHeaders: {Authorization : `Bearer ${myToken}`}
      })
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.toast.warning({ detail: "Warning", summary: "Token bị hết hạn, hãy đăng nhập lại" });
            this.router.navigate(['login']);
          } else if (err.status === 403) {
            this.toast.error({ detail: "Forbidden", summary: "Từ chối truy cập" });
          } else if (err.status === 404) {
            // this.toast.error({ detail: "Not Found", summary: "Không tìm thấy nguồn" });
          } else {
            // this.toast.error({ detail: "Server Error", summary: "Server xảy ra lỗi" });
          }
        } else {
          this.toast.error({ detail: "Network Error", summary: "Không thể kết nối với server" });
        }
        return throwError(() => err); // Rethrow the error after handling
      })
    );
  }

}
