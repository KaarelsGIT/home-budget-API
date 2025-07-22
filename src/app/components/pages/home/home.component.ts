import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';

interface CategoryTotals {
  [category: string]: {
    monthlyAmounts: { [month: string]: number };
    total: number;
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
  currentYear = new Date().getFullYear();

  incomeTotals: CategoryTotals = {};
  expenseTotals: CategoryTotals = {};
  monthlyTotals = {
    income: {} as { [month: string]: number },
    expense: {} as { [month: string]: number },
    balance: {} as { [month: string]: number }
  };

  totalIncome = 0;
  totalExpense = 0;
  totalBalance = 0;

  constructor(private transactionService: TransactionService) {
    this.months.forEach(month => {
      this.monthlyTotals.income[month] = 0;
      this.monthlyTotals.expense[month] = 0;
      this.monthlyTotals.balance[month] = 0;
    });
  }

  ngOnInit() {
    this.loadYearData();
  }

  private loadYearData() {
    const filters = {
      year: this.currentYear,
      page: 0,
      size: 1000,
      sortBy: 'date',
      sortOrder: 'desc'
    };

    this.transactionService.getTransactions('income', filters).subscribe({
      next: (response) => {
        response.transactionPage.content.forEach((transaction: any) => {
          const date = new Date(transaction.date);
          const month = this.months[date.getMonth()];
          const category = transaction.category?.name || 'Uncategorized';
          const amount = transaction.amount;

          if (!this.incomeTotals[category]) {
            this.incomeTotals[category] = {
              monthlyAmounts: {},
              total: 0
            };
            this.months.forEach(m => {
              this.incomeTotals[category].monthlyAmounts[m] = 0;
            });
          }

          this.incomeTotals[category].monthlyAmounts[month] += amount;
          this.incomeTotals[category].total += amount;

          // Update monthly totals
          this.monthlyTotals.income[month] += amount;
          this.totalIncome += amount;
        });
        this.updateBalances();
      }
    });

    this.transactionService.getTransactions('expense', filters).subscribe({
      next: (response) => {
        response.transactionPage.content.forEach((transaction: any) => {
          const date = new Date(transaction.date);
          const month = this.months[date.getMonth()];
          const category = transaction.category?.name || 'Uncategorized';
          const amount = transaction.amount;

          // Initialize category if it doesn't exist
          if (!this.expenseTotals[category]) {
            this.expenseTotals[category] = {
              monthlyAmounts: {},
              total: 0
            };
            this.months.forEach(m => {
              this.expenseTotals[category].monthlyAmounts[m] = 0;
            });
          }

          this.expenseTotals[category].monthlyAmounts[month] += amount;
          this.expenseTotals[category].total += amount;

          this.monthlyTotals.expense[month] += amount;
          this.totalExpense += amount;
        });
        this.updateBalances();
      }
    });
  }

  private updateBalances() {
    this.months.forEach(month => {
      this.monthlyTotals.balance[month] =
        this.monthlyTotals.income[month] - this.monthlyTotals.expense[month];
    });
    this.totalBalance = this.totalIncome - this.totalExpense;
  }

  getCategories(type: 'income' | 'expense'): string[] {
    return Object.keys(type === 'income' ? this.incomeTotals : this.expenseTotals);
  }
}
