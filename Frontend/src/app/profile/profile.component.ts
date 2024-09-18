import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  subscription: any;
  userImage: string = '';
  user: any = {};
  infoError: string = '';
  currentPasswordError: string = '';
  passwordError: string = '';
  state: string = '';
  chaningPass: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private _ProfileService: ProfileService,
    private _Router: Router
  ) {}

  name: string = '';
  image: any;

  setName(name: string) {
    this.name = name;
  }

  setImage(event: any) {
    const img = event.target.files[0];
    if (img) {
      this.image = img;
    }
  }

  passwordForm = new FormGroup({
    currentPassword: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
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

  getUser() {
    this.state = 'Loading user data...';
    this.subscription = this._ProfileService.getUser().subscribe({
      next: (res) => {
        this.user = res.data;
        this.name = this.user.name;
        this.state = 'Data loaded';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
      error: (err) => {
        this.state = 'Error loading data';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  updatePassword(formDate: FormGroup) {
    this.state = 'Changing password...';
    this._ProfileService.updateUserPassword(formDate.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this._AuthService.saveCurrentUser();
        this.state = 'Password changed successfully';
        setTimeout(() => {
          this.state = '';
          this._Router.navigate(['/home']);
        }, 1000);
      },
      error: (err) => {
        this.state = 'Failed to change Password';
        err.error.errors.map((error: any) => {
          if (error.path === 'currentPassword') {
            this.currentPasswordError = error.msg;
          } else if (error.path === 'password') {
            this.passwordError = error.msg;
          }
        });
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
    });
  }

  updateUser() {
    this.state = 'Updating user data...';
    const formDate = new FormData();
    formDate.append('name', this.name);
    if (this.image) {
      formDate.append('image', this.image);
    }
    this._ProfileService.updateUser(formDate).subscribe({
      next: (res) => {
        this.getUser();
        this.state = 'User updated successfully';
        setTimeout(() => {
          this.state = '';
        }, 1000);
      },
      error: (err) => {
        this.state = 'Failed to update user data';
        setTimeout(() => {
          this.state = '';
        }, 1000);
        console.log(err);
      },
    });
  }

  removeUser() {
    if (confirm("Do you want to remove you'r account?")) {
      this.state = 'Removing user...';
      this._ProfileService.deleteUser().subscribe({
        next: (res) => {
          this._AuthService.logOut();
          this._Router.navigate(['/home']);
          this.state = 'User removed successfully';
          setTimeout(() => {
            this.state = '';
          }, 1000);
        },
        error: (err) => {
          this.state = 'Failed to remove user data';
          setTimeout(() => {
            this.state = '';
          }, 1000);
          console.log(err);
        },
      });
    } else {
    }
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.userImage = this._ProfileService.userImage;
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
