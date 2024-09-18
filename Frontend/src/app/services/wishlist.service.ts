import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private api: string = '';

  constructor(
    private _HttpClient: HttpClient,
    private _GlobalServices: GlobalService
  ) {
    const { hostName, wishlistRoute } = this._GlobalServices;
    this.api = `${hostName}${wishlistRoute}`;
  }

  addProductToWishlist(product: string): Observable<any> {
    return this._HttpClient.post(
      this.api,
      { product },
      { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  getUserWishlist(): Observable<any> {
    return this._HttpClient.get(this.api, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  removeItemFromWishlist(itemId: string): Observable<any> {
    return this._HttpClient.delete(`${this.api}/${itemId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
