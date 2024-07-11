import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserCookiesService } from '../services/user-cookies.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  refreshToken() {
    throw new Error('Method not implemented.');
  }

  apiURL: string = environment.apiUrl;

  constructor(public http: HttpClient, public UserCookies: UserCookiesService) { }

  login(username: string, password: string) {
    const formData = new FormData();
    formData.append('email', username);
    formData.append('password', password);
    return this.http.post('https://drewryportal.com/stagingusersmgr/authenticationapi/verifyUser', formData);
  }
}

