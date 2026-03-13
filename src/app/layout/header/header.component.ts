import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {CalculatorComponent} from '../../components/shared/calculator/calculator.component';
import {ActiveUserService} from '../../services/active-user.service';
import {AuthService} from '../../services/auth.service';
import {LoginModalComponent} from '../../components/shared/auth/login-modal/login-modal.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CalculatorComponent,
    LoginModalComponent,
    NgIf
  ],
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.css'
})
export class HeaderComponent implements OnInit {
  activeUser: User | null = null;
  authenticatedUser: User | null = null;
  isCalculatorVisible = false;
  isLoginModalVisible = false;

  constructor(
    private activeUserService: ActiveUserService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.authenticatedUser = user;
    });

    this.activeUserService.getActiveUser().subscribe(user => {
      this.activeUser = user;
    });
  }

  openLoginModal(): void {
    this.isLoginModalVisible = true;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/about']);
  }

  toggleCalculator() {
    this.isCalculatorVisible = !this.isCalculatorVisible;
  }
}
