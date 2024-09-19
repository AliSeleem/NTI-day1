import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent implements OnInit {
  sendMailError: string = '';
  verifyCodeError: string = '';
  resetPasswordError: string = '';
  sendMailFlag: boolean = false;
  verifyCodeFlag: boolean = false;

  sendMailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  verifyCodeForm = new FormGroup({
    resetCode: new FormControl('', [
      Validators.required,
      Validators.maxLength(6),
    ]),
  });

  resetPasswordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
  });

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  sendMail(formData: FormGroup) {
    this._AuthService.sendMail(formData.value).subscribe({
      next: (res) => {
        localStorage.setItem('verify', res.resetToken);
        this.sendMailFlag = true;
      },
      error: (err) => {
        this.sendMailError = err.error.message;
      },
    });
  }

  verifyCode(formData: FormGroup) {
    this._AuthService.verifyCode(formData.value).subscribe({
      next: (res) => {
        this.verifyCodeFlag = true;
      },
      error: (err) => {
        this.verifyCodeError = err.error.message;
      },
    });
  }

  resetPassword(formData: FormGroup) {
    this._AuthService.resetPassword(formData.value).subscribe({
      next: (res) => {
        localStorage.removeItem('verify');
        this.sendMailFlag = false;
        this.verifyCodeFlag = false;
        this._Router.navigate(['/login']);
      },
      error: (err) => {
        this.resetPasswordError = err.error.message;
      },
    });
  }

  ngOnInit(): void {}
}
