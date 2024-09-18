import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReviewsService } from '../services/reviews.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  subscription: any;
  id: string = '';
  imgDomain: string = '';
  product: any = {};
  reviewError: string = '';
  state: string = '';
  isLogin: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private _ActivatedRoute: ActivatedRoute,
    private _ReviewsService: ReviewsService,
    private _ProductsService: ProductsService,
    private _WishlistService: WishlistService,
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

  reviewForm = new FormGroup({
    comment: new FormControl(null, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    rating: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
  });

  loadProduct(): any {
    this.subscription = this._ProductsService
      .getProduct(this.id)
      .subscribe((res) => {
        this.product = res.data;
      });
  }

  isObjectEmpty(objectName: any) {
    return (
      Object.keys(objectName).length === 0 && objectName.constructor === Object
    );
  }

  addToWishlist(productId: string) {
    this.state = 'Adding product to wishlist';
    this._WishlistService.addProductToWishlist(productId).subscribe({
      next: (res) => {
        this.state = 'Product added to wishlist';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  addToCart(productId: string) {
    this.state = 'Adding product to cart';
    this._CartService.addProductToCart(productId).subscribe((res) => {
      this.state = 'Product added to cart';
      setTimeout(() => {
        this.state = '';
      }, 1000);
    });
  }

  addReview(productId: string, formData: FormGroup) {
    this.state = 'Adding review';
    this._ReviewsService.addReview(productId, formData.value).subscribe({
      next: (res) => {
        this.state = 'Review added';
        setTimeout(() => {
          this.state = '';
        }, 1000);
        this.loadProduct();
      },
      error: (err) => {
        this.state = 'Error adding review';
        setTimeout(() => {
          this.state = '';
        }, 1000);
        if (err.error.errors) {
          err.error.errors.map((error: any) => {
            if (error.path === 'product') {
              this.reviewError = error.msg;
            }
          });
        } else {
          this.reviewError = `login first to add review`;
        }
        console.log(err);
      },
    });
  }

  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.params['id'];
    this.imgDomain = this._ProductsService.productImages;
    this.loadProduct();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
