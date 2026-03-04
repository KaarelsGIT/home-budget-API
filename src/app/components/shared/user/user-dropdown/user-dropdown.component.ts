import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../models/user';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActiveUserService} from '../../../../services/active-user.service';

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
export class UserDropdownComponent implements OnInit, OnChanges {
  @Input() selectedUser: number | string | null = null;
  @Input() styleType: 'header' | 'form' = 'form';
  @Output() selectedUserChange = new EventEmitter<string | number | null>();
  @Input() placeholder: string = 'All Users';

  users: User[] = [];
  activeUser: User | null = null;
  isDropdownOpen = false;
  backendError = false;

  constructor(private userService: UserService,
              private activeUserService: ActiveUserService) {
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.backendError = false;
        if (this.selectedUser) {
          this.activeUser = this.users.find(u => u.id == this.selectedUser) || null;
        }
      },
      () => {
        this.backendError = true;
        this.users = [];
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && this.users.length > 0) {
      this.activeUser = this.users.find(u => u.id == this.selectedUser) || null;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setActiveUser(user: User): void {
    this.activeUser = user;
    this.selectedUserChange.emit(user.id);
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
