import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Redirect to a default route or just return false
      // Since the login is a modal, we might want to redirect to a 'welcome' page or similar.
      // For now, let's redirect to 'about' which could serve as a landing page if not logged in.
      // Or we can just redirect to the home page, and if it's protected, we might have a loop.
      // Let's assume we'll protect all routes except 'about'.
      return this.router.parseUrl('/about');
    }
  }
}
