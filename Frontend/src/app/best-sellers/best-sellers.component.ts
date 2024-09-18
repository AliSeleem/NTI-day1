import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DescriptionPipe } from '../pipes/description.pipe';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [CommonModule, DescriptionPipe, RouterLink],
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.scss',
})
export class BestSellersComponent implements OnInit, OnDestroy {
  subscription: any;
  search: string = '';
  imgDomain: string = '';
  products: any[] = [];
  state: string = '';
  isLogin: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private _ProductsService: ProductsService,
    private _CartService: CartService
  ) {
    _AuthService.currentUser.subscribe(() => {
      if (_AuthService.currentUser.getValue() !== null) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    });
  }

  addToCart(producrId: string) {
    this._CartService.addProductToCart(producrId).subscribe((res) => {
      this.state = 'Adding product to cart...';
      setTimeout(() => {
        this.state = '';
      }, 1000);
    });
  }

  ngOnInit(): void {
    this.imgDomain = this._ProductsService.productImages;
    this.subscription = this._ProductsService
      .getProducts(16, 1, '-sold', this.search)
      .subscribe((res) => {
        this.products = res.data;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
