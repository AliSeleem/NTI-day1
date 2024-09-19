import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  api: string = '';
  userImage: string = '';

  constructor(
    private _GlobalServices: GlobalService,
    private _HttpClient: HttpClient
  ) {
    const { hostName, usersRoute, userImage } = this._GlobalServices;
    this.api = `${hostName}${usersRoute}`;
    this.userImage = userImage;
  }

  getUser(): Observable<any> {
    return this._HttpClient.get(`${this.api}/me`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  deleteUser(): Observable<any> {
    return this._HttpClient.delete(`${this.api}/deleteMe`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  updateUser(formData: any): Observable<any> {
    return this._HttpClient.put(`${this.api}/updateMe`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  updateUserPassword(formData: any): Observable<any> {
    return this._HttpClient.put(`${this.api}/changeMyPassword`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
