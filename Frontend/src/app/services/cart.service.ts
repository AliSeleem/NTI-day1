import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private api: string = 'http://localhost:5000/api/v1/carts';

  constructor(private _HttpClient: HttpClient) {}

  addProductToCart(product: string): Observable<any> {
    return this._HttpClient.post(
      this.api,
      { product },
      { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }
}
