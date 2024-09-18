import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { Signup, Login } from '../interfaces/auth';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  hostName: string = '';
  routeName: string = '';

  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router,
    private _GlobalService: GlobalService
  ) {
    this.hostName = this._GlobalService.hostName;
    this.routeName = this._GlobalService.authRoute;

    if (localStorage.getItem('token') !== null) {
      this.saveCurrentUser();
    }
  }

  currentUser = new BehaviorSubject(null);
  loginPhoto: string = 'images/login.jpg';
  signupPhoto: string = 'images/signup.jpg';

  saveCurrentUser() {
    const token = localStorage.getItem('token');
    this.currentUser.next(jwtDecode(token!));
  }

  signUp(formData: Signup): Observable<any> {
    return this._HttpClient.post(
      `${this.hostName}${this.routeName}/signup`,
      formData
    );
  }

  logIn(formData: Login): Observable<any> {
    return this._HttpClient.post(
      `${this.hostName}${this.routeName}/login`,
      formData
    );
  }

  checkToken() {
    const token: any = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp! < Date.now() / 1000) {
      this.logOut();
      this._Router.navigate(['/home']);
    }
  }

  logOut() {
    localStorage.removeItem('token');
    this.currentUser.next(null);
  }

  sendMail(formData: Login): Observable<any> {
    return this._HttpClient.post(
      `${this.hostName}${this.routeName}/forgetPassword`,
      formData
    );
  }

  verifyCode(formData: Login): Observable<any> {
    return this._HttpClient.post(
      `${this.hostName}${this.routeName}/verifyCode`,
      formData,
      { headers: { authorization: `Bearer ${localStorage.getItem('verify')}` } }
    );
  }

  resetPassword(formData: Login): Observable<any> {
    return this._HttpClient.put(
      `${this.hostName}${this.routeName}/resetCode`,
      formData,
      { headers: { authorization: `Bearer ${localStorage.getItem('verify')}` } }
    );
  }
}
