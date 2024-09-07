import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private api: string = 'http://localhost:5000/api/v1/products';
  imgDomain: string = `http://localhost:5000/products/`;

  constructor(private _HttpClient: HttpClient) {}

  getProducts(
    limit: number = 16,
    page: number = 1,
    sort: string = '-createdAt',
    search: string
  ): Observable<any> {
    return this._HttpClient.get(
      `${this.api}/?limit=${limit}&page=${page}&sort=${sort}&search=${search}`
    );
  }

  getProduct(id: String): Observable<any> {
    return this._HttpClient.get(`${this.api}/${id}`);
  }
}
