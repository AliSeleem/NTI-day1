import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pagination } from '../interfaces/pagination';
import { AuthService } from '../services/auth.service';
import { OrdersService } from '../services/orders.service';
import { GlobalService } from '../services/global.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit, OnDestroy {
  subscription: any;
  orders: any[] = [];
  details: any = {};
  ordersLength: number = 0;
  page: number = 1;
  pagination: Pagination = {};
  search: string = '';
  productImage: string = '';
  status: string = '';

  constructor(
    private _AuthService: AuthService,
    private _OrdersService: OrdersService,
    private _GlobalService: GlobalService
  ) {}

  loadOrders() {
    this.status = 'Loading...';
    this.subscription = this._OrdersService
      .getUserOrders(undefined, this.page, '-createdAt', this.search)
      .subscribe({
        next: (res) => {
          this.orders = res.data;
          if (!this.orders.length) this.status = 'No oreders';
          else this.status = '';
          this.pagination = res.pagination;
          this.ordersLength = res.length;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  changePage(page: number) {
    this.page = page;
    this.orders = [];
    this.loadOrders();
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.productImage = this._GlobalService.productsImages;
    this.loadOrders();
  }

  isObjectEmpty(objectName: any) {
    return (
      Object.keys(objectName).length === 0 && objectName.constructor === Object
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
