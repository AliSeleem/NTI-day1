import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor() {}
  hostName: string = 'http://localhost:5000';
  authRoute: string = '/api/v1/auth';
  productsRoute: string = '/api/v1/products';
  categoriesRoute: string = '/api/v1/categories';
  orderRoute: string = '/api/v1/orders';
  subcategoriesRoute: string = '/api/v1/subcategories';
  cartRoute: string = '/api/v1/carts';
  usersRoute: string = '/api/v1/users';
  wishlistRoute: string = '/api/v1/wishlist';
  reviewsRoute: string = '/api/v1/reviews';
  productsImages: string = `${this.hostName}/products/`;
  userImage: string = `${this.hostName}/users/`;
}
