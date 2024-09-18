import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private api: string = '';
  productImages: string = '';

  constructor(
    private _HttpClient: HttpClient,
    private _GlobalServices: GlobalService
  ) {
    const { hostName, productsRoute } = this._GlobalServices;
    this.api = `${hostName}${productsRoute}`;
    this.productImages = this._GlobalServices.productsImages;
  }

  getProducts(
    limit: number = 16,
    page: number = 1,
    sort: string = '-createdAt',
    search: string,
    category: string = '',
    subcategory: string = ''
  ): Observable<any> {
    const query = `${
      this.api
    }/?limit=${limit}&page=${page}&sort=${sort}&search=${search}${
      category && '&category=' + category
    }${subcategory && '&subCategory=' + subcategory}`;
    return this._HttpClient.get(query);
  }

  getProduct(id: String): Observable<any> {
    return this._HttpClient.get(`${this.api}/${id}`);
  }
}
