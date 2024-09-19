import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CouponsService {
  private api: string = '';
  private routeName: string = '';
  constructor(
    private _HttpClient: HttpClient,
    private _GlobalService: GlobalService
  ) {
    const { hostName, couponsRoute } = this._GlobalService;
    this.api = `${hostName}${couponsRoute}`;
  }

  getCoupons(
    limit: number = 50,
    page: number = 1,
    sort: string = '-createdAt',
    search: string
  ): Observable<any> {
    return this._HttpClient.get(
      `${this.api}?limit=${limit}&page=${page}&sort=${sort}&search=${search}`,
      { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  getCoupon(couponId: string): Observable<any> {
    return this._HttpClient.get(`${this.api}/${couponId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  createCoupon(formData: any): Observable<any> {
    return this._HttpClient.post(`${this.api}`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  updateCoupon(couponId: string, formData: any): Observable<any> {
    return this._HttpClient.put(`${this.api}/${couponId}`, formData, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  deleteCoupon(couponId: string): Observable<any> {
    return this._HttpClient.delete(`${this.api}/${couponId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
