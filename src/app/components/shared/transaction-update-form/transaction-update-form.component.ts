import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {CategoryDropdownComponent} from '../category-dropdown/category-dropdown.component';

@Component({
  selector: 'app-transaction-update-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    CategoryDropdownComponent
  ],
  templateUrl: './transaction-update-form.component.html',
  styleUrl: './transaction-update-form.component.css'
})
export class TransactionUpdateFormComponent implements OnChanges, OnInit {
  @Input() type!: 'income' | 'expense';
  @Input() transaction: any;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  users: User[] = [];
  isLoading = false;

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      this.isLoading = false;
    }
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  onCategoryIdChange(categoryId: string | number | null) {
    const parsedId = categoryId !== null ? Number(categoryId) : null;

    if (this.transaction.category) {
      this.transaction.category.id = parsedId;
    } else {
      this.transaction.category = { id: parsedId };
    }
  }

  onSave() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.save.emit(this.transaction);
  }

  onClose() {
    this.isLoading = false;
    this.close.emit();
  }
}
