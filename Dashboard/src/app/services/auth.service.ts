import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api: string = '';
  loginPhoto: string = 'images/login.jpg';

  constructor(
    private _HttpClient: HttpClient,
    private _GlobalService: GlobalService,
    private _Router: Router
  ) {
    const { hostName, authRoute } = this._GlobalService;
    this.api = `${hostName}${authRoute}`;
    if (localStorage.getItem('token') !== null) {
      this.saveCurrentUser();
    }
  }

  currentUser = new BehaviorSubject(null);

  saveCurrentUser() {
    const token: any = localStorage.getItem('token');
    this.currentUser.next(jwtDecode(token));
  }

  checkToken() {
    const token: any = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp! < Date.now() / 1000) {
      this.logout();
      this._Router.navigate(['/login']);
    }
  }

  login(formData: any): Observable<any> {
    return this._HttpClient.post(`${this.api}/login`, formData);
  }

  sendMail(formData: any): Observable<any> {
    return this._HttpClient.post(`${this.api}/forgetPassword`, formData);
  }

  verifyCode(formData: any): Observable<any> {
    return this._HttpClient.post(`${this.api}/verifyCode`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('verify')}` },
    });
  }

  resetPassword(formData: any): Observable<any> {
    return this._HttpClient.put(`${this.api}/resetCode`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('verify')}` },
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.next(null);
  }
}
