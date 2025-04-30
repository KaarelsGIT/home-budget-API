import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {CategoryService} from '../../../services/category.service';
import {Category} from '../../../models/category';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-transaction-update-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
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

  isLoading = false;

  categories: Category[] = [];
  users: User[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      this.isLoading = false;
    }
  }

  ngOnInit(){
    this.loadCategories();
    this.loadUsers();
  }

  constructor(private categoryService: CategoryService,
              private userService: UserService,) {
  }

  loadCategories() {
    this.categoryService.getCategoriesByType(this.type, true).subscribe(categories => {
      this.categories = categories;
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
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
