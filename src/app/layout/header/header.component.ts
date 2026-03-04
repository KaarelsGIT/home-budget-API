import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {UserDropdownComponent} from '../../components/shared/user/user-dropdown/user-dropdown.component';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {CalculatorComponent} from '../../components/shared/calculator/calculator.component';
import {ActiveUserService} from '../../services/active-user.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    UserDropdownComponent,
    CalculatorComponent
  ],
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.css'
})
export class HeaderComponent {
  activeUser: User | null = null;
  isCalculatorVisible = false;

  constructor(private userService: UserService, private activeUserService: ActiveUserService) {
  }

  onUserChange(userId: string | number | null): void {
    console.log('Selected user in header:', userId);
    this.activeUserService.setActiveUser(userId);
    this.userService.getUserById(userId).subscribe(user => {
      this.activeUser = user;
    });
  }

  toggleCalculator() {
    this.isCalculatorVisible = !this.isCalculatorVisible;
  }
}
