import {CommonModule} from '@angular/common';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TransactionService} from '../../../../services/transaction.service';
import {TransactionAddFormComponent} from '../add-transaction/transaction-add-form.component';
import {TransactionFilterComponent} from '../filter-transaction/transaction-filter.component';
import {TransactionUpdateFormComponent} from '../update-transaction-modal/transaction-update-form.component';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  templateUrl: './transaction-table.component.html',
  imports: [
    CommonModule,
    FormsModule,
    TransactionAddFormComponent,
    TransactionFilterComponent,
    TransactionUpdateFormComponent
  ],
  styleUrls: ['./transaction-table.component.css']
})
export class TransactionTableComponent implements OnInit {
  @Input() type!: 'income' | 'expense';

  isFormVisible = false;
  isModalVisible = false;
  selectedTransactionId: number | null = null;
  editedTransaction: any = null;
  totalElements: number = 0;
  hasMorePages: boolean = false;


  transactions: any[] = [];
  years: any[] = [];
  pageTotal: number = 0;
  allTotal: number = 0;

  filters = {
    userId: null as string | number | null,
    categoryId: null as string | number | null,
    month: new Date().getMonth() + 1,
    date: null,
    year: new Date().getFullYear(),
    sortBy: 'date',
    sortOrder: 'desc',
    page: 0,
    size: 20
  };


  constructor(private transactionService: TransactionService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      this.fetchYears();
      this.refreshTable();
    }
  }

  ngOnInit(): void {
    // Both fetchYears and fetchTransactions will be called by ngOnChanges
    // when the initial @Input 'type' is set.
  }

  fetchYears(): void {
    this.transactionService.getYears(this.type).subscribe(years => {
      this.years = years;
    })
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  applyFilters(updatedFilters?: any): void {
    if (updatedFilters) {
      this.filters = { ...updatedFilters };
    }
    this.refreshTable();
  }

  setSort(column: string): void {
    if (this.filters.sortBy === column) {
      this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.filters.sortBy = column;
      this.filters.sortOrder = 'desc';
    }

    this.filters.page = 0; // Always reset to first page when changing sort
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    if (!this.type) {
      console.warn('TransactionTableComponent.fetchTransactions: this.type is not defined');
      return;
    }

    const params: any = {...this.filters};
    // Ensure numeric types for API filters
    params.year = (params.year !== null && params.year !== 'null' && params.year !== '') ? Number(params.year) : null;
    params.month = (params.month !== null && params.month !== 'null' && params.month !== '') ? Number(params.month) : null;
    params.userId = (params.userId !== null && params.userId !== 'null' && params.userId !== '') ? Number(params.userId) : null;
    params.categoryId = (params.categoryId !== null && params.categoryId !== 'null' && params.categoryId !== '') ? Number(params.categoryId) : null;

    if (params.sortBy === 'date') {
      params.sortBy = 'created';
    }

    console.log(`Fetching ${this.type} transactions with params:`, params);

    this.transactionService.getTransactions(this.type, params).subscribe({
      next: (response) => {
        if (response && response.transactionPage) {
          this.transactions = response.transactionPage.content;
          this.totalElements = response.transactionPage.page.totalElements;
          this.hasMorePages = (this.filters.page + 1) * this.filters.size < this.totalElements;
          this.pageTotal = response.pageTotal;
          this.allTotal = response.allTotal;
        } else {
          console.warn('Unexpected API response structure:', response);
          this.transactions = [];
        }
      },
      error: (error) => {
        console.error('API error:', error);
        this.transactions = [];
      }
    });
  }

  onPageSizeChange(): void {
    this.filters.page = 0;
    this.fetchTransactions();
  }

  changePage(direction: number): void {
    this.filters.page += direction;
    this.fetchTransactions();
  }

  getSelectedTransaction() {
    return this.transactions.find(t => t.id === this.selectedTransactionId);
  }

  onEdit(transactionId: number) {
    this.editedTransaction = this.transactions.find(t => t.id === transactionId);
    this.isModalVisible = true;
  }

  onSave(updatedTransaction: any) {
    this.transactionService.updateTransaction(this.type, updatedTransaction.id, updatedTransaction)
      .subscribe({
        next: (response) => {
          console.log('Transaction updated successfully:', response);
          this.transactionService.refreshTransactions();
          this.refreshTable();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating transaction:', error);
        }
      });
  }


  closeModal() {
    this.isModalVisible = false;
    this.editedTransaction = null;
    this.refreshTable();
  }

  onDelete(type: 'income' | 'expense', id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(type, id).subscribe({
        next: (response) => {
          if (response && response.success) {
            console.log(`Transaction ${id} deleted!`);
            this.transactionService.refreshTransactions();
            this.refreshTable();
          } else {
            console.error('Unexpected response format', response);
          }
        },
        error: (err) => {
          console.error('Delete failed:', err);
        }
      });
    }
  }

  refreshTable(): void {
    this.filters.page = 0;
    this.fetchTransactions();
  }
}
