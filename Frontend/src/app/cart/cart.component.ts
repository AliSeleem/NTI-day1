import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';
import { CartService } from '../services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  subscription: any;
  cart: any = {};
  productsLength: number = 0;
  productsImage: string = '';
  address: string = '';
  couponError: string = '';
  state: string = '';
  addressError: string = '';

  couponForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
  });

  constructor(
    private _AuthService: AuthService,
    private _GlobalService: GlobalService,
    private _CartService: CartService,
    private _OrdersService: OrdersService,
    private _Router: Router
  ) {}

  loadCart() {
    this.state = 'Loading cart...';
    this.subscription = this._CartService.getUserCart().subscribe({
      next: (res) => {
        this.cart = res.data;
        this.productsLength = res.length;
        this.state = 'Cart loaded successfully';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
      error: (err) => {
        this.state = err.error.message;
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  updateProductQuantity(item: string, product: any, quantity: number) {
    this.state = 'Updating product quantity';
    this._CartService.updateProductQuantity(item, product, quantity).subscribe({
      next: (res) => {
        this.cart = res.data;
        this.loadCart();
        this.state = 'Product quantity updated successfully';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.state = 'Error updating product quantity';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  clearCart() {
    this._CartService.clearCart().subscribe({
      next: (res) => {
        this.state = 'Cart cleared successfully';
        setTimeout(() => {
          this.state = '';
        }, 1000);
        this._Router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.state = 'Error clearing cart';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  removeItemFromCart(itemId: string) {
    this.state = 'Removing item';
    this._CartService.removeProductFromCart(itemId).subscribe({
      next: (res) => {
        this.loadCart();
        this.state = 'Item removed successfully';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.state = 'Error removing item';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  addCoupon(formData: FormGroup) {
    this.state = 'Adding coupon';
    this._CartService.applyCoupon(formData.value).subscribe({
      next: (res) => {
        this.loadCart();
        this.state = 'Coupon added successfully';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
      error: (err) => {
        console.log(err);
        this.couponError = err.error?.message;
        this.state = 'Error adding coupon';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  createOrder() {
    if (!this.address) {
      this.addressError = 'Please select an address';
      return;
    }
    this.state = 'Creating order';
    this._OrdersService.createOrder(this.address).subscribe({
      next: (res) => {
        this.state = 'Order created successfully';
        setTimeout(() => {
          this.state = '';
        }, 1000);
        this._Router.navigate(['/myOrders']);
      },
      error: (err) => {
        console.log(err);
        this.state = 'Error creating order';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.productsImage = this._GlobalService.productsImages;
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
