import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pagination } from '../interfaces/pagination';
import { AuthService } from '../services/auth.service';
import { ReviewsService } from '../services/reviews.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent implements OnInit, OnDestroy {
  subscription: any;
  reviews: any[] = [];
  reviewsLength: number = 0;
  page: number = 1;
  pagination: Pagination = {};
  search: string = '';
  productImage: string = '';
  state: string = '';
  status: string = '';
  updating: boolean = false;

  comment: string = '';
  rate: number = 1;

  constructor(
    private _AuthService: AuthService,
    private _ReviewsService: ReviewsService,
    private _GlobalService: GlobalService
  ) {}

  loadReviews() {
    this.status = 'Loading...';
    this.subscription = this._ReviewsService
      .getUserReviews(undefined, this.page, '-createdAt', this.search)
      .subscribe({
        next: (res) => {
          this.reviews = res.data;
          if (this.reviews.length) {
            this.status = '';
          } else {
            this.status = 'You do not have reviews';
          }
          this.pagination = res.pagination;
          this.reviewsLength = res.length;
        },
        error: (err) => {
          this.status = 'Error!';
        },
      });
  }

  removeReview(reviewId: string) {
    this.state = 'Removing review...';
    this._ReviewsService.deleteUserReview(reviewId).subscribe({
      next: (res) => {
        this.loadReviews();
        this.state = 'Review removed successfully';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
      error: (err) => {
        this.state = 'Error removing review';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  setUpdating(review: any) {
    this.updating = true;
    this.comment = review.comment;
    this.rate = review.rating;
  }

  updateReview(reviewId: string) {
    this.state = 'Updating review...';
    this._ReviewsService
      .updateUserReview(reviewId, { comment: this.comment, rating: this.rate })
      .subscribe({
        next: (res) => {
          this.loadReviews();
          this.updating = false;
          this.state = 'Review updated successfully';
          setTimeout(() => {
            this.state = '';
          }, 1000);
        },
        error: (err) => {
          this.state = 'Error updating review';
          setTimeout(() => {
            this.state = '';
          }, 1000);
        },
      });
  }

  changePage(page: number) {
    this.page = page;
    this.reviews = [];
    this.loadReviews();
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.productImage = this._GlobalService.productsImages;
    this.loadReviews();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
