import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { Signup, Login } from '../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    if (localStorage.getItem('token') !== null) {
      this.saveCurrentUser();
    }
  }

  currentUser = new BehaviorSubject(null);
  authPhoto: string = 'images/phone.svg';

  saveCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(typeof token);
      this.currentUser.next(jwtDecode(token));
    } else {
      console.log('no token');
    }
  }

  signUp(formData: Signup): Observable<any> {
    return this._HttpClient.post(
      'http://localhost:5000/api/v1/auth/signup',
      formData
    );
  }

  logIn(formData: Login): Observable<any> {
    return this._HttpClient.post(
      'http://localhost:5000/api/v1/auth/login',
      formData
    );
  }

  checkToken() {
    const token: any = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp! < Date.now() / 1000) {
      this.logOut();
      this._Router.navigate(['/login']);
    }
  }

  logOut() {
    localStorage.removeItem('token');
    this.currentUser.next(null);
  }
}
