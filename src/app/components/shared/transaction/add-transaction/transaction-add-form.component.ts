import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TransactionService} from '../../../../services/transaction.service';
import {FormsModule} from '@angular/forms';
import {TitleCasePipe} from '@angular/common';
import {UserService} from '../../../../services/user.service';
import {User} from "../../../../models/user";
import {UserDropdownComponent} from '../../user/user-dropdown/user-dropdown.component';
import {CategoryDropdownComponent} from '../../category/category-dropdown/category-dropdown.component';
import {CategoryService} from '../../../../services/category.service';
import {Category} from '../../../../models/category';
import {ActiveUserService} from '../../../../services/active-user.service';
import {Subscription} from 'rxjs';
import {evaluateMathExpression} from '../../../../utils/math-evaluator';

@Component({
  selector: 'app-add-transaction',
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
export class TransactionAddFormComponent implements OnInit, OnDestroy {
  @Input() type!: 'income' | 'expense';
  @Input() activeUser: User | null = null;
  @Output() transactionAdded = new EventEmitter<void>();

  private userSubscription: Subscription | null = null;

  constructor(private transactionService: TransactionService,
              private userService: UserService,
              private categoryService: CategoryService,
              private activeUserService: ActiveUserService) {
  }

  transaction = {
    user: this.activeUser as User | null,
    category: null as Category | null,
    amount: null as string | number | null,
    date: '',
    description: ''
  };

  ngOnInit(): void {
    if (this.activeUser) {
      this.transaction.user = this.activeUser;
    }

    // Subscribe to globally selected user from ActiveUserService
    this.userSubscription = this.activeUserService.getActiveUser().subscribe(user => {
      this.transaction.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

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

  sanitizeAmount() {
    if (typeof this.transaction.amount === 'string') {
      const calculatedResult = evaluateMathExpression(this.transaction.amount);
      if (calculatedResult !== null && !isNaN(calculatedResult)) {
        this.transaction.amount = calculatedResult.toString();
      }
    }
  }

  addTransaction(): void {
    const normalizedAmount = Number(this.transaction.amount);

    if (!normalizedAmount || !this.transaction.date) {
      alert('Amount and Date are required!');
      return;
    }

    const transactionData = {
      ...this.transaction,
      amount: normalizedAmount, // Use normalized amount
      user: this.transaction.user ? { id: this.transaction.user.id } : null,
      category: this.transaction.category,
      date: this.transaction.date,
      description: this.transaction.description,
    };

    this.transactionService.addTransaction(this.type, transactionData).subscribe({
      next: () => {
        alert(`${this.type} added successfully!`);
        this.transactionService.refreshTransactions();
        this.transactionAdded.emit();
        this.transaction = {
          user: this.transaction.user,
          category: this.transaction.category,
          amount: null,
          date: this.transaction.date,
          description: '',
        };
      },
      error: (err) => {
        console.error('Error adding transaction:', err);
        alert('Failed to add transaction.');
      },
    });
  }
}
