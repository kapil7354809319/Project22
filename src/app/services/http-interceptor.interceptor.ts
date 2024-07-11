import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCookiesService } from "./user-cookies.service";

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  constructor(public userCookies: UserCookiesService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const urlSegments = request.url.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];
    if (lastSegment !== 'verifyUser' && lastSegment !== 'login') {
      const authToken = this.userCookies.getCookie('CurrentUser').token;
      if (authToken) {
        const authRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`
          }
        });
        return next.handle(authRequest);
      }
    }
    return next.handle(request);
  }
}
