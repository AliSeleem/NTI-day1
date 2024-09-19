import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { SubcategoriesService } from '../services/subcategories.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
})
export class UpdateProductComponent implements OnInit {
  subscription: any;
  productId: string = '';
  product: any = {};
  categories: any[] = [];
  subcategories: any[] = [];

  productForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    category: new FormControl(null, [Validators.required]),
    subcategory: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
  });

  constructor(
    private fb: FormBuilder,
    private _ProductService: ProductsService,
    private _CategoriesService: CategoriesService,
    private _SubcategoriesService: SubcategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  LoadProduct() {
    this.subscription = this._ProductService
      .getProduct(this.productId)
      .subscribe({
        next: (res) => {
          this.product = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  loadCategories() {
    this._CategoriesService
      .getCategories(undefined, undefined, undefined, '')
      .subscribe({
        next: (res) => {
          this.categories = res.data;
          this.loadSubcategories(this.product.category?._id);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  loadSubcategories(categoryId: string) {
    console.log(categoryId);
    this._SubcategoriesService.getSpecificSubcategories(categoryId).subscribe({
      next: (res) => {
        this.subcategories = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateProduct(productId: string, formData: FormGroup) {
    this._ProductService.updateProduct(productId, formData.value).subscribe({
      next: (res) => {
        this.router.navigate(['/layout/products']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.params['id'];
    this.LoadProduct();
    this.loadCategories();
  }
}
