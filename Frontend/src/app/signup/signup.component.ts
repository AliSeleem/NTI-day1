import { CommonModule } from '@angular/common';
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
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  state: string = '';

  constructor(private _AuthService: AuthService, private _Router: Router) {}
  signupForm = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
    confirmPassword: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
  });

  emailErrors: string = '';
  passwordErrors: string = '';
  signupImage: string = '';

  signup(formData: FormGroup) {
    this.state = 'Signing...';
    this._AuthService.signUp(formData.value).subscribe({
      next: (res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this._AuthService.saveCurrentUser();
        }
        this.state = '';
        this._Router.navigate(['/home']);
      },
      error: (err) => {
        err.error.errors?.map((error: any) => {
          if (error.path === 'email') this.emailErrors = error.msg;
          if (error.path === 'password') this.passwordErrors = error.msg;
        });
        this.state = 'Error';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  ngOnInit(): void {
    this.signupImage = this._AuthService.signupPhoto;
  }
}
