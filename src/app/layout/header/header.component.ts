import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {UserDropdownComponent} from '../../shared/user-dropdown/user-dropdown.component';
import {User} from '../../models/user';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    UserDropdownComponent
  ],
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.css'
})
export class HeaderComponent {
  activeUser: User | null = null;

  onUserChange(userId: string | number | null): void {
    console.log('Selected user in header:', userId);
  }
}
