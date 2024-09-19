import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DescriptionPipe } from '../pipes/description.pipe';
import { RouterLink } from '@angular/router';
import { Pagination } from '../interfaces/pagination';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { CategoriesServices } from '../services/categoris.service';
import { SubCategoriesService } from '../services/sub-categories.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, DescriptionPipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  subscription: any;
  products: any[] = [];
  categoris: any[] = [];
  category: string = '';
  subCategoris: any[] = [];
  subCategory: string = '';
  pagination: Pagination = {};
  imgDomain: string = '';
  search: string = '';
  page: number = 1;
  state: string = '';
  status: string = '';
  isLogin: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private _ProductsService: ProductsService,
    private _CategoriesServices: CategoriesServices,
    private _SubCategoriesServices: SubCategoriesService,
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

  loadProducts() {
    this.status = 'loading...';
    this.subscription = this._ProductsService
      .getProducts(
        16,
        this.page,
        undefined,
        this.search,
        this.category,
        this.subCategory
      )
      .subscribe({
        next: (res) => {
          this.products = res.data;
          this.pagination = res.pagination;
          if (!this.products.length) {
            this.status = 'No Products';
          } else {
            this.status = '';
          }
        },
        error: (err) => {
          console.log(err);
          this.status = 'Error';
        },
      });
  }

  loadCategoris() {
    this.subscription = this._CategoriesServices
      .getCategories()
      .subscribe((res) => {
        this.categoris = res.data;
      });
    this.loadProducts();
  }

  setCategory(id: string) {
    this.search = '';
    this.products = [];
    this.pagination = {};
    this.subCategoris = [];
    this.category = id;
    this.subCategory = '';
    this.loadSubCategoris();
    this.loadProducts();
  }

  loadSubCategoris() {
    this.subscription = this._SubCategoriesServices
      .getSubCategories(this.category)
      .subscribe((res) => {
        this.subCategoris = res.data;
      });
    this.loadProducts();
  }

  setSearch(searchText: string) {
    this.search = searchText;
    this.category = '';
    this.subCategoris = [];
    this.subCategory = '';
    this.products = [];
    this.loadProducts();
  }

  setSubCategory(id: string) {
    this.products = [];
    this.pagination = {};
    this.subCategory = id;
    this.loadProducts();
  }

  addProductToCart(producrId: string) {
    this.state = 'Adding product to cart';
    this._CartService.addProductToCart(producrId).subscribe((res) => {
      this.state = 'Product added to cart';
      setTimeout(() => {
        this.state = '';
      }, 1000);
    });
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.products = [];
    this.loadProducts();
  }

  ngOnInit(): void {
    this.loadCategoris();
    this.loadProducts();
    this.imgDomain = this._ProductsService.productImages;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
