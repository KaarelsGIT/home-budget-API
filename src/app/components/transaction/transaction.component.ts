import { Component, Input, OnInit } from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TransactionService} from '../../services/transaction.service';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @Input() type!: 'income' | 'expense';

  transactions: any[] = [];
  categories: any[] = [];
  pageTotal: number = 0;
  allTotal: number = 0;

  filters = {
    userId: null,
    categoryId: null,
    date: null,
    year: null,
    sortBy: 'date',
    sortOrder: 'desc',
    page: 0,
    size: 20
  };

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchTransactions();
  }

  fetchCategories(): void {
    this.categoryService.getCategoriesByType(this.type).subscribe(categories => {
      this.categories = categories;
    });
  }

  fetchTransactions(): void {
    if (!this.type) return;

    this.transactionService.getTransactions(this.type, this.filters).subscribe(response => {
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
