import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  api: string = '';
  userImage: string = '';

  constructor(
    private _HttpClient: HttpClient,
    private _GlobalService: GlobalService
  ) {
    const { hostName, usersRoute } = this._GlobalService;
    this.api = `${hostName}${usersRoute}`;
    this.userImage = this._GlobalService.userImage;
  }

  getUsers(
    limit: number = 50,
    page: number = 1,
    sort: string = '-createdAt',
    search: string,
    role: string = 'admin'
  ): Observable<any> {
    return this._HttpClient.get(
      `${this.api}?limit=${limit}&page=${page}&sort=${sort}&search=${search}&role=${role}&fields=-password`,
      { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  getUser(userId: string): Observable<any> {
    return this._HttpClient.get(`${this.api}/${userId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  createUser(formData: any): Observable<any> {
    return this._HttpClient.post(`${this.api}`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  updateUser(userId: string, formData: any): Observable<any> {
    return this._HttpClient.put(`${this.api}/${userId}`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  updateUserPassword(userId: string, formData: any): Observable<any> {
    return this._HttpClient.put(
      `${this.api}/${userId}/changePassword`,
      formData,
      { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  deleteUser(userId: string): Observable<any> {
    return this._HttpClient.delete(`${this.api}/${userId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
