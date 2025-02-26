import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TransactionService} from '../../../services/transaction.service';
import {FormsModule} from '@angular/forms';
import {TitleCasePipe} from '@angular/common';
import {UserService} from '../../../services/user.service';
import {User} from "../../../models/user";
import {UserDropdownComponent} from '../user-dropdown/user-dropdown.component';
import {CategoryDropdownComponent} from '../category-dropdown/category-dropdown.component';
import {CategoryService} from '../../../services/category.service';
import {Category} from '../../../models/category';

@Component({
  selector: 'app-transaction-add-form',
  standalone: true,
  imports: [
    FormsModule,
    TitleCasePipe,
    UserDropdownComponent,
    CategoryDropdownComponent
  ],
  templateUrl: './transaction-add-form.component.html',
  styleUrl: './transaction-add-form.component.css'
})
export class TransactionAddFormComponent implements OnInit {
  @Input() type!: 'income' | 'expense';
  @Output() transactionAdded = new EventEmitter<void>();

  ngOnInit(): void {
  }

  constructor(private transactionService: TransactionService,
              private userService: UserService,
              private categoryService: CategoryService) {
  }

  activeUser: User | null = null;

  transaction = {
    user: null as User | null,
    category: null as Category | null,
    amount: null,
    date: '',
    description: ''
  };

  onUserChange(userId: string | number | null): void {
    if (userId === null) {
      this.transaction.user = null;
      return;
    }

    this.userService.getUserById(userId).subscribe(user => {
      this.transaction.user = user;
    });
  }

  onCategoryChange(categoryId: string | number | null): void {
    if (categoryId === null) {
      this.transaction.category = null;
      return;
    }

    this.categoryService.getCategoryById(categoryId).subscribe(category => {
        this.transaction.category = category;
      });
  }


  addTransaction(): void {
    if (!this.transaction.amount || !this.transaction.date) {
      alert('Amount and Date are required!');
      return;
    }

    const transactionData = {
      ...this.transaction,
      user: this.transaction.user ? {id: this.transaction.user.id} : null,
      category: this.transaction.category,
      amount: this.transaction.amount,
      date: this.transaction.date,
      description: this.transaction.description
    };

    this.transactionService.addTransaction(this.type, transactionData).subscribe({
      next: () => {
        alert(`${this.type} added successfully!`);
        this.transactionAdded.emit();
        this.transaction = {
          user: null,  // <-- Reset user valik
          category: null,
          amount: null,
          date: '',
          description: ''
        };
      },
      error: (err) => {
        console.error('Error adding transaction-table:', err);
        alert('Failed to add transaction-table.');
      }
    });
  }

}
