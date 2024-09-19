import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuard } from './guards/auth.guard';
import { rolesGuard } from './guards/roles.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgetPassword',
    title: 'Forget password',
    loadComponent: () =>
      import('./forget-password/forget-password.component').then(
        (m) => m.ForgetPasswordComponent
      ),
  },
  {
    path: 'layout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./sidebar/sidebar.component').then((m) => m.SidebarComponent),
    children: [
      {
        path: 'categories',
        children: [
          {
            path: '',
            title: 'All categories',
            loadComponent: () =>
              import('./categories/categories.component').then(
                (m) => m.CategoriesComponent
              ),
          },
          {
            path: 'create',
            title: 'Create category',
            loadComponent: () =>
              import('./add-categories/add-categories.component').then(
                (m) => m.AddCategoriesComponent
              ),
          },
          {
            path: ':id/update',
            title: 'Update category',
            loadComponent: () =>
              import('./update-categories/update-categories.component').then(
                (m) => m.UpdateCategoriesComponent
              ),
          },
        ],
      },
      {
        path: 'subCategories',
        children: [
          {
            path: '',
            title: 'All subCategories',
            loadComponent: () =>
              import('./subcategories/subcategories.component').then(
                (m) => m.SubcategoriesComponent
              ),
          },
          {
            path: 'create',
            title: 'Create category',
            loadComponent: () =>
              import('./add-subcategories/add-subcategories.component').then(
                (m) => m.AddSubcategoriesComponent
              ),
          },
          {
            path: ':id/update',
            title: 'Update category',
            loadComponent: () =>
              import(
                './update-subcategories/update-subcategories.component'
              ).then((m) => m.UpdateSubcategoriesComponent),
          },
        ],
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            title: 'products',
            loadComponent: () =>
              import('./products/products.component').then(
                (m) => m.ProductsComponent
              ),
          },
          {
            path: 'create',
            title: 'create product',
            loadComponent: () =>
              import('./add-product/add-product.component').then(
                (m) => m.AddProductComponent
              ),
          },
          {
            path: ':id/update',
            title: 'update product',
            loadComponent: () =>
              import('./update-product/update-product.component').then(
                (m) => m.UpdateProductComponent
              ),
          },
        ],
      },
      {
        path: 'coupons',
        children: [
          {
            path: '',
            title: 'coupons',
            loadComponent: () =>
              import('./coupons/coupons.component').then(
                (m) => m.CouponsComponent
              ),
          },
          {
            path: 'create',
            title: 'create coupon',
            loadComponent: () =>
              import('./add-coupon/add-coupon.component').then(
                (m) => m.AddCouponComponent
              ),
          },
          {
            path: ':id/update',
            title: 'update coupon',
            loadComponent: () =>
              import('./update-coupon/update-coupon.component').then(
                (m) => m.UpdateCouponComponent
              ),
          },
        ],
      },
      {
        path: 'users',
        canActivate: [rolesGuard],
        children: [
          {
            path: '',
            title: 'users',
            loadComponent: () =>
              import('./users/users.component').then((m) => m.UsersComponent),
          },
          {
            path: 'create',
            title: 'create user',
            loadComponent: () =>
              import('./add-user/add-user.component').then(
                (m) => m.AddUserComponent
              ),
          },
        ],
      },
      {
        path: 'orders',
        title: 'orders',
        loadComponent: () =>
          import('./orders/orders.component').then((m) => m.OrdersComponent),
      },
      {
        path: 'profile',
        title: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
  { path: '**', title: '404 Not Found', component: NotFoundComponent },
];
