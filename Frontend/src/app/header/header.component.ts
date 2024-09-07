import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isLogin: boolean = false;

  constructor(private _AuthService: AuthService, private _Router: Router) {
    _AuthService.currentUser.subscribe(() => {
      if (_AuthService.currentUser.getValue() !== null) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    });
  }

  logOut() {
    this._AuthService.logOut();
    this._Router.navigate(['/login']);
  }
}
