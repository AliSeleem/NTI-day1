import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  api: string = '';

  constructor(
    private _HttpClient: HttpClient,
    private _GlobalService: GlobalService
  ) {
    const { hostName, categoriesRoute } = this._GlobalService;
    this.api = `${hostName}${categoriesRoute}`;
  }

  getCategories(
    limit: number = 50,
    page: number = 1,
    sort: string = '-createdAt',
    search: string
  ): Observable<any> {
    return this._HttpClient.get(
      `${this.api}?limit=${limit}&page=${page}&sort=${sort}&search=${search}`
    );
  }

  getCategory(categoryId: string): Observable<any> {
    return this._HttpClient.get(`${this.api}/${categoryId}`);
  }

  createCategory(formData: any): Observable<any> {
    return this._HttpClient.post(`${this.api}`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  updateCategory(categoryId: string, formData: any): Observable<any> {
    return this._HttpClient.put(`${this.api}/${categoryId}`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this._HttpClient.delete(`${this.api}/${categoryId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
