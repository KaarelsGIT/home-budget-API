import { Component, Input, OnInit } from '@angular/core';
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TransactionService} from '../../services/transaction.service';
import {CategoryService} from '../../services/category.service';
import {UserService} from '../../services/user.service';
import {MONTHS} from '../month-list';
import {TransactionFormComponent} from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-transaction',
  standalone: true,
  templateUrl: './transaction.component.html',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    DatePipe,
    TransactionFormComponent
  ],
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @Input() type!: 'income' | 'expense';
  isFormVisible = false;
  months = MONTHS;

  transactions: any[] = [];
  categories: any[] = [];
  users: any[] = [];
  years: any[] = [];
  pageTotal: number = 0;
  allTotal: number = 0;

  filters = {
    userId: null,
    categoryId: null,
    date: null,
    year: null,
    month: null,
    sortBy: 'date',
    sortOrder: 'desc',
    page: 0,
    size: 20
  };

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchUsers();
    this.fetchYears();
    this.fetchTransactions();
    this.fetchMonths();
  }

  fetchCategories(): void {
    this.categoryService.getCategoriesByType(this.type).subscribe(categories => {
      this.categories = categories;
    });
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  fetchYears(): void {
    this.transactionService.getYears(this.type).subscribe(years => {
      this.years = years;
    })
  }

  fetchMonths(): void {
    const params: any = {
      month: this.months
    }
  }

  fetchTransactions(): void {
    if (!this.type) return;

    const params: any = { ...this.filters };
    params.year = params.year ? Number(params.year) : null;
    params.month = params.month ? Number(params.month) : null;
    params.userId = params.userId ? Number(params.userId) : null;
    params.categoryId = params.categoryId ? Number(params.categoryId) : null;

    console.log('Sending filters:', params);

    this.transactionService.getTransactions(this.type, params).subscribe(response => {
      this.transactions = response.transactionPage.content;
      this.pageTotal = response.pageTotal;
      this.allTotal = response.allTotal;
    }, error => {
      console.error('API error:', error);
    });
  }

  setSort(column: string): void {
    if (this.filters.sortBy === column) {
      this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.filters.sortBy = column;
      this.filters.sortOrder = 'desc';
    }

    this.fetchTransactions();
  }

  applyFilters(): void {
    this.filters.page = 0;
    this.fetchTransactions();
  }

  changePage(direction: number): void {
    this.filters.page += direction;
    this.fetchTransactions();
  }
}
