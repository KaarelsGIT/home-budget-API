import {Component, HostListener, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {User} from '../../../models/user';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './user-dropdown.component.html',
  styleUrl: './user-dropdown.component.css'
})
export class UserDropdownComponent implements OnInit {
  users: User[] = [];
  activeUser: User | null = null;
  isDropdownOpen = false;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      if (users.length > 0) {
        this.activeUser = users[0]; // Vaikimisi esimene kasutaja
      }
    });
  }

  setActiveUser(user: User): void {
    this.activeUser = user;
    this.isDropdownOpen = false; // Sulge dropdown peale valikut
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    if (!(event.target as HTMLElement).closest('.user-dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
