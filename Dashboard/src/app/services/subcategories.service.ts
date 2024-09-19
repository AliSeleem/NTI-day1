import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  private api: string = '';
  private categoriesRoute: string = '';

  constructor(
    private _HttpClient: HttpClient,
    private _GlobalService: GlobalService
  ) {
    const { hostName, subcategoriesRoute, categoriesRoute } =
      this._GlobalService;
    this.api = `${hostName}${subcategoriesRoute}`;
    this.categoriesRoute = `${hostName}${categoriesRoute}`;
  }

  getSpecificSubcategories(
    categoryId: string,
    limit: number = 200,
    sort: string = 'name'
  ): Observable<any> {
    return this._HttpClient.get(
      `${this.categoriesRoute}/${categoryId}/subcategories?limit=${limit}&sort=${sort}`
    );
  }

  getSubcategories(
    limit: number = 50,
    page: number = 1,
    sort: string = '-createdAt',
    search: string
  ): Observable<any> {
    return this._HttpClient.get(
      `${this.api}?limit=${limit}&page=${page}&sort=${sort}&search=${search}`
    );
  }

  getSubcategory(subcategoryId: string): Observable<any> {
    return this._HttpClient.get(`${this.api}/${subcategoryId}`);
  }

  createSubcategory(formData: any): Observable<any> {
    return this._HttpClient.post(`${this.api}`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  updateSubcategory(subcategoryId: string, formData: any): Observable<any> {
    return this._HttpClient.put(`${this.api}/${subcategoryId}`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  deleteSubcategory(subcategoryId: string): Observable<any> {
    return this._HttpClient.delete(`${this.api}/${subcategoryId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
