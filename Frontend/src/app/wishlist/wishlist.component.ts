import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';
import { GlobalService } from '../services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit, OnDestroy {
  subscrption: any;
  wishlist: any[] = [];
  wishlistLength: number = 0;
  productImage: string = '';
  status: string = '';
  state: string = '';

  constructor(
    private _AuthServices: AuthService,
    private _GlobalService: GlobalService,
    private _WishlistService: WishlistService,
    private _CartService: CartService
  ) {}

  loadWishlist() {
    this.status = 'Loading...';
    this.subscrption = this._WishlistService.getUserWishlist().subscribe({
      next: (res) => {
        this.wishlist = res.data;
        if (!this.wishlist.length) this.status = 'No products';
        else this.status = '';
        this.wishlistLength = res.length;
      },
      error: (err) => {
        this.status = 'An Error occurred';
      },
    });
  }

  remiveItem(itemId: string) {
    this.state = 'Removing..';
    this._WishlistService.removeItemFromWishlist(itemId).subscribe({
      next: (res) => {
        this.loadWishlist();
        this.state = 'Product removed';
        setTimeout(() => {
          this.state = '';
        }, 700);
      },
      error: (err) => {
        this.state = 'Failed to remove';
        setTimeout(() => {
          this.state = '';
        }, 700);
        console.log(err);
      },
    });
  }

  addProductToCart(itemId: string) {
    this.state = 'Adding to cart';
    this._CartService.addProductToCart(itemId).subscribe({
      next: (res) => {
        this.state = 'Product added to cart';
        setTimeout(() => {
          this.state = '';
        }, 700);
      },
      error: (err) => {
        this.state = 'Failed to add to cart';
        setTimeout(() => {
          this.state = '';
        }, 700);
      },
    });
  }

  ngOnInit(): void {
    this._AuthServices.checkToken();
    this.productImage = this._GlobalService.productsImages;
    this.loadWishlist();
  }

  ngOnDestroy(): void {
    this.subscrption.unsubscribe();
  }
}
