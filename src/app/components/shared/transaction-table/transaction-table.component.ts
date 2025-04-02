import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TransactionService} from '../../../services/transaction.service';
import {TransactionAddFormComponent} from '../transaction-add-form/transaction-add-form.component';
import {TransactionFilterComponent} from '../transaction-filter/transaction-filter.component';
import {TransactionUpdateFormComponent} from '../transaction-update-form/transaction-update-form.component';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  templateUrl: './transaction-table.component.html',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    DatePipe,
    TransactionAddFormComponent,
    TransactionFilterComponent,
  ],
  styleUrls: ['./transaction-table.component.css']
})
export class TransactionTableComponent implements OnInit {
  @Input() type!: 'income' | 'expense';

  isFormVisible = false;
  selectedTransactionId: number | null = null;

  transactions: any[] = [];
  years: any[] = [];
  pageTotal: number = 0;
  allTotal: number = 0;

  filters = {
    userId: null as string | number | null,
    categoryId: null as string | number | null,
    month: null as number | null,
    date: null,
    year: null,
    sortBy: 'date',
    sortOrder: 'desc',
    page: 0,
    size: 20
  };

  constructor(private transactionService: TransactionService) {
  }

  ngOnInit(): void {
    this.fetchYears();
    this.fetchTransactions();
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
    this.filters.page = 0;
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    if (!this.type) return;

    const params: any = {...this.filters};
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

  changePage(direction: number): void {
    this.filters.page += direction;
    this.fetchTransactions();
  }

  onEdit(transaction: any) {
    this.selectedTransactionId = this.selectedTransactionId === transaction.id ? null : transaction.id;
  }

  onSave(transaction: any) {
    this.transactionService.updateTransaction(transaction).subscribe(() => {
      this.selectedTransactionId = null;
      this.refreshTable();
    }, error => {
      console.error('Update failed:', error);
    });
  }

  onDelete(type: 'income' | 'expense', id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(type, id).subscribe({
        next: (response) => {
          if (response && response.success) {
            console.log(`Transaction ${id} deleted!`);
            this.refreshTable(); // Refresh the table after successful deletion
          } else {
            console.error('Unexpected response format', response);
            // Optionally, you can notify the user of a failure here
          }
        },
        error: (err) => {
          console.error('Delete failed:', err);
          // Notify the user about the error here
        }
      });
    }
  }

  refreshTable(): void {
    this.fetchTransactions();
  }
}
