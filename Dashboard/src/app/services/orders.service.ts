import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private api: string = '';

  constructor(
    private _HttpClient: HttpClient,
    private _GlobalService: GlobalService
  ) {
    const { hostName, orderRoute } = this._GlobalService;
    this.api = `${hostName}${orderRoute}`;
  }

  getOrders(
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

  getOrder(orderId: string): Observable<any> {
    return this._HttpClient.get(`${this.api}/${orderId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  updateDeliveredOrder(orderId: string): Observable<any> {
    return this._HttpClient.put(
      `${this.api}/${orderId}/delivered`,
      {},
      { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  updatePaidOrder(orderId: string): Observable<any> {
    return this._HttpClient.put(
      `${this.api}/${orderId}/paid`,
      {},
      { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }
}
