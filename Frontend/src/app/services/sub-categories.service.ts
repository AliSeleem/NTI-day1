import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubCategoriesService {
  api: string = '';

  constructor(
    private _HttpClient: HttpClient,
    private _GlobalServices: GlobalService
  ) {
    const { hostName, categoriesRoute } = this._GlobalServices;
    this.api = `${hostName}${categoriesRoute}`;
  }

  getSubCategories(categoryID: string): Observable<any> {
    return this._HttpClient.get(`${this.api}/${categoryID}/subcategories`);
  }
}
