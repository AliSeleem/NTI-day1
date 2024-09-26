import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import { SubcategoriesService } from '../services/subcategories.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit, OnDestroy {
  categoriesSubscription: any;
  subcategoriesSubscription: any;
  categories: any[] = [];
  subcategories: any[] = [];
  getName: string = '';
  getDescription: string = '';
  getPrice: string = '0';
  getQuantity: string = '0';
  getCategory: string = '';
  getSubcategory: string = '';
  cover: File | null = null;
  images: File[] = [];

  setCover(event: any) {
    const cover = event.target.files[0];
    if (cover) {
      this.cover = cover;
    }
  }

  setImages(event: any) {
    const images: any = [];
    for (let i = 0; i < event.target.files.length; i++) {
      images.push(event.target.files[i]);
    }
    if (images) {
      this.images = images;
    }
  }

  constructor(
    private _Router: Router,
    private _AuthService: AuthService,
    private _ProductsService: ProductsService,
    private _CategoriesService: CategoriesService,
    private _SubcategoriesService: SubcategoriesService
  ) {}

  loadCategories() {
    this.categoriesSubscription = this._CategoriesService
      .getCategories(200, 1, 'name', '')
      .subscribe({
        next: (res) => {
          this.categories = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  loadSubcategories(categoryId: string) {
    this.getCategory = categoryId;
    this.subcategoriesSubscription = this._SubcategoriesService
      .getSpecificSubcategories(categoryId, 200, 'name')
      .subscribe({
        next: (res) => {
          this.subcategories = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  createProduct() {
    const formData = new FormData();
    formData.append('name', this.getName);
    formData.append('description', this.getDescription);
    formData.append('category', this.getCategory);
    formData.append('subCategory', this.getSubcategory);
    formData.append('price', this.getPrice);
    formData.append('quantity', this.getQuantity);
    if (this.cover) {
      formData.append('cover', this.cover);
    }
    if (this.images.length) {
      this.images.forEach((image) => formData.append('images', image));
    }

    this._ProductsService.createProduct(formData).subscribe({
      next: (res) => {
        alert('product added successfully');
        this._Router.navigate(['/layout/products']);
      },
    });
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
    if (this.subcategoriesSubscription) {
      this.subcategoriesSubscription.unsubscribe();
    }
  }
}
