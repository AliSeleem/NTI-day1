import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  state: string = '';

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
  });

  loginImg: string = '';
  invalidLogin: string = '';

  login(formData: FormGroup) {
    this.state = 'Loging...';
    this._AuthService.logIn(formData.value).subscribe({
      next: (res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this._AuthService.saveCurrentUser();
        }
        this.state = '';
        this._Router.navigate(['/home']);
      },
      error: (err) => {
        this.invalidLogin = err.error.message;
        this.state = 'Error';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  ngOnInit(): void {
    this.loginImg = this._AuthService.loginPhoto;
  }
}
