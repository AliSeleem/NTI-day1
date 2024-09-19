import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const rolesGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const _Router = inject(Router);
  const user: any = _AuthService.currentUser.getValue();
  console.log(user);
  if (user.role !== 'manager') {
    _Router.navigate(['/login']);
    return false;
  } else {
    return true;
  }
};
