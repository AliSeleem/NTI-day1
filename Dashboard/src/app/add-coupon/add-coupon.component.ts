import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CouponsService } from '../services/coupons.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-coupon',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-coupon.component.html',
  styleUrl: './add-coupon.component.scss',
})
export class AddCouponComponent implements OnInit {
  couponError: string = '';
  couponForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    discount: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
    expireTime: new FormControl(null, [Validators.required]),
  });
  constructor(
    private _AuthService: AuthService,
    private _CouponsService: CouponsService,
    private _Router: Router
  ) {}

  createCoupon(formData: FormGroup) {
    this._CouponsService.createCoupon(formData.value).subscribe({
      next: (res) => {
        alert('coupon added');
        this._Router.navigate(['/layout/coupons']);
      },
      error: (err) => {
        this.couponError = err.error.errors[0].msg;
      },
    });
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
  }
}
