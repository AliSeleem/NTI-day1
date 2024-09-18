import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private api: string = '';

  constructor(
    private _HttpClient: HttpClient,
    private _GlobalServices: GlobalService
  ) {
    const { hostName, cartRoute } = this._GlobalServices;
    this.api = `${hostName}${cartRoute}`;
  }

  addProductToCart(product: string): Observable<any> {
    return this._HttpClient.post(
      this.api,
      { product },
      { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  updateProductQuantity(
    item: string,
    product: any,
    quantity: number
  ): Observable<any> {
    return this._HttpClient.put(
      `${this.api}/${item}`,
      { product, quantity },
      {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
  }

  getUserCart(): Observable<any> {
    return this._HttpClient.get(this.api, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(this.api, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  removeProductFromCart(itemId: string): Observable<any> {
    return this._HttpClient.delete(`${this.api}/${itemId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  applyCoupon(coupon: string): Observable<any> {
    return this._HttpClient.put(`${this.api}/applyCoupon`, coupon, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
