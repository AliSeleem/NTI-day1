import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DescriptionPipe } from '../pipes/description.pipe';
import { RouterLink } from '@angular/router';
import { Pagination } from '../interfaces/pagination';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, DescriptionPipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  subscription: any;
  products: any[] = [];
  pagination: Pagination = {};
  imgDomain: string = '';
  search: string = '';
  page: number = 1;

  constructor(
    private _AuthService: AuthService,
    private _ProductsService: ProductsService,
    private _CartService: CartService
  ) {}

  loadProducts() {
    this.imgDomain = this._ProductsService.imgDomain;
    this.subscription = this._ProductsService
      .getProducts(16, this.page, undefined, this.search)
      .subscribe((res) => {
        this.products = res.data;
        this.pagination = res.pagination;
      });
  }

  addProductToCart(producrId: string) {
    this._CartService.addProductToCart(producrId).subscribe((res) => {
      alert('Product added successfully');
    });
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.loadProducts();
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
