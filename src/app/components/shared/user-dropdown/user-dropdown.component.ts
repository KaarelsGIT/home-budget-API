import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css'],
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
})
export class UserDropdownComponent implements OnInit {
  @Input() selectedUser: number | string | null = null;
  @Input() styleType: 'header' | 'form' = 'form';
  @Output() selectedUserChange = new EventEmitter<string | number | null>();

  users: User[] = [];
  activeUser: User | null = null;
  isDropdownOpen = false;
  backendError = false;  // Vea lipu määramine

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.loadSelectedUser();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.backendError = false;
        this.activeUser = this.users.find(u => u.id === this.selectedUser) || null;
      },
      () => {
        this.backendError = true;
        this.users = [];
      }
    );
  }

  loadSelectedUser(): void {
    const storedUserId = localStorage.getItem('selectedUserId');
    if (storedUserId) {
      const user = this.users.find(u => u.id === +storedUserId);
      if (user) {
        this.activeUser = user;
      }
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setActiveUser(user: User): void {
    this.activeUser = user;
    this.selectedUserChange.emit(user.id);
    localStorage.setItem('selectedUserId', user.id.toString());
    this.isDropdownOpen = false;
  }

  setActiveUserFromId(userId: string | number): void {
    if (userId === null) {
      this.fetchUsers();
    }

    this.activeUser = this.users.find(u => u.id == userId) || null;
    this.selectedUserChange.emit(userId);
  }
}
