import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  api: string = '';
  productsImages: string = '';
  constructor(
    private _HttpClient: HttpClient,
    private _GlobalService: GlobalService
  ) {
    const { hostName, productsRoute } = this._GlobalService;
    this.api = `${hostName}${productsRoute}`;
    this.productsImages = this._GlobalService.productsImages;
  }

  getAllProducts(
    limit: number = 50,
    page: number = 1,
    sort: string = '-createdAt',
    search: string
  ): Observable<any> {
    return this._HttpClient.get(
      `${this.api}?limit=${limit}&page=${page}&sort=${sort}&search=${search}`
    );
  }

  getProduct(productId: string): Observable<any> {
    return this._HttpClient.get(`${this.api}/${productId}`);
  }

  createProduct(formData: any): Observable<any> {
    return this._HttpClient.post(`${this.api}`, formData, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }

  updateProduct(productId: string, formData: any): Observable<any> {
    return this._HttpClient.put(`${this.api}/${productId}`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  deleteProduct(productId: string): Observable<any> {
    return this._HttpClient.delete(`${this.api}/${productId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
