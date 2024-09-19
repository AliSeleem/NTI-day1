import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit, OnDestroy {
  subscription: any;
  userSubscription: any;
  users: any[] = [];
  user: any;
  selectedUser: any;
  userImage: string = '';
  page: number = 1;
  search: string = '';
  role: string = 'admin';
  pagination: any = {};

  constructor(
    private _AuthService: AuthService,
    private _UsersService: UsersService
  ) {}

  updateUserForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  updateUser(userId: string, formData: FormGroup) {
    this._UsersService.updateUser(userId, formData.value).subscribe({
      next: (res) => {},
      error: (err) => {},
    });
  }

  updatePasswordForm = new FormGroup({
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
  });

  updatePassword(userId: string, formData: FormGroup) {
    this._UsersService.updateUserPassword(userId, formData.value).subscribe({
      next: (res) => {},
      error: (err) => {},
    });
  }

  loadUsers() {
    this.subscription = this._UsersService
      .getUsers(undefined, this.page, 'name', this.search, this.role)
      .subscribe({
        next: (res) => {
          this.users = res.data;
          this.pagination = res.pagination;
        },
        error: (err) => {},
      });
  }

  changeUserActive(userId: string) {
    this.userSubscription = this._UsersService.getUser(userId).subscribe({
      next: (res) => {
        this.user = res.data;
        this._UsersService
          .updateUser(userId, { active: !this.user.active })
          .subscribe({
            next: (res) => {
              this.loadUsers();
              alert('user activation updated');
            },
            error: (err) => {},
          });
      },
      error: (err) => {},
    });
  }

  deleteUser(userId: string) {
    this._UsersService.deleteUser(userId).subscribe({
      next: (res) => {
        this.loadUsers();
        alert('user deleted successfully');
      },
      error: (err) => {
        console.log(err)
      },
    });
  }

  changePage(page: number) {
    this.page = page;
    this.loadUsers();
  }

  searchData(data: string) {
    this.search = data;
    this.loadUsers();
  }

  filterUsers(filter: string) {
    this.role = filter;
    this.loadUsers();
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.userImage = this._UsersService.userImage;
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
