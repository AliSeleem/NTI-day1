import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  api: string = '';
  constructor(
    private _HttpClient: HttpClient,
    private _GlobalService: GlobalService
  ) {
    const { hostName, orderRoute } = _GlobalService;
    this.api = `${hostName}${orderRoute}`;
  }

  getUserOrders(
    limit: number = 50,
    page: number = 1,
    sort: '-createdAt',
    search: string
  ): Observable<any> {
    return this._HttpClient.get(
      `${this.api}?limit=${limit}&page=${page}&sort=${sort}&search=${search}`,
      {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
  }

  createOrder(address: string): Observable<any> {
    return this._HttpClient.post(
      this.api,
      { address },
      {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
  }
}
