import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';
import { YearDropdownComponent } from '../../shared/transaction/year-dropdown/year-dropdown.component';
import { MonthDropdownComponent, MONTHS } from '../../shared/transaction/month-dropdown/month-dropdown.component';
import { Subscription, forkJoin } from 'rxjs';
import { skip } from 'rxjs/operators';

interface CategoryTotals {
  [category: string]: {
    monthlyAmounts: { [month: string]: number };
    total: number;
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, YearDropdownComponent, MonthDropdownComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  currentYear = new Date().getFullYear();
  selectedMonth: number | null = null;
  monthsList = MONTHS;

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

  private refreshSubscription: Subscription | null = null;
  private dataSubscription: Subscription | null = null;

  constructor(private transactionService: TransactionService) {
    this.resetTotals();
  }

  ngOnInit() {
    // Subscription skip(1) väldib esimest kohe emititavat väärtust
    this.refreshSubscription = this.transactionService.refreshTransactions$.pipe(skip(1))
      .subscribe(() => {
        this.loadYearData();
      });

    // Laadime andmed esimesel renderdamisel
    this.loadYearData();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  onYearChange(year: number | null): void {
    if (year) {
      this.currentYear = year;
      this.loadYearData();
    }
  }

  onMonthChange(month: number | null): void {
    this.selectedMonth = month;
    this.loadYearData();
  }

  private resetTotals() {
    this.incomeTotals = {};
    this.expenseTotals = {};
    this.totalIncome = 0;
    this.totalExpense = 0;
    this.totalBalance = 0;

    this.months.forEach(month => {
      this.monthlyTotals.income[month] = 0;
      this.monthlyTotals.expense[month] = 0;
      this.monthlyTotals.balance[month] = 0;
    });
  }

  private loadYearData() {
    // Cancel any previous forkJoin request
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    this.resetTotals();

    const filters: any = {
      year: this.currentYear,
      page: 0,
      size: 1000,
      sortBy: 'date',
      sortOrder: 'desc'
    };

    if (this.selectedMonth) {
      filters.month = this.selectedMonth;
    }

    this.dataSubscription = forkJoin({
      incomes: this.transactionService.getTransactions('income', filters),
      expenses: this.transactionService.getTransactions('expense', filters)
    }).subscribe({
      next: ({ incomes, expenses }) => {

        /* ===== INCOME PROCESSING ===== */
        incomes.transactionPage.content.forEach((transaction: any) => {
          if (transaction.category?.type !== 'INCOME') return;

          const date = new Date(transaction.date);
          const month = this.months[date.getMonth()];
          const category = transaction.category?.name || 'Uncategorized';
          const amount = Number(transaction.amount);

          if (!this.incomeTotals[category]) {
            this.incomeTotals[category] = {
              monthlyAmounts: {},
              total: 0
            };
            this.months.forEach(m => this.incomeTotals[category].monthlyAmounts[m] = 0);
          }

          this.incomeTotals[category].monthlyAmounts[month] += amount;
          this.incomeTotals[category].total += amount;

          this.monthlyTotals.income[month] += amount;
          this.totalIncome += amount;
        });

        /* ===== EXPENSE PROCESSING ===== */
        expenses.transactionPage.content.forEach((transaction: any) => {
          if (transaction.category?.type !== 'EXPENSE') return;

          const date = new Date(transaction.date);
          const month = this.months[date.getMonth()];
          const category = transaction.category?.name || 'Uncategorized';
          const amount = Number(transaction.amount);

          if (!this.expenseTotals[category]) {
            this.expenseTotals[category] = {
              monthlyAmounts: {},
              total: 0
            };
            this.months.forEach(m => this.expenseTotals[category].monthlyAmounts[m] = 0);
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

  getDisplayedMonths(): string[] {
    if (this.selectedMonth) {
      return [this.months[this.selectedMonth - 1]];
    }
    return this.months;
  }

  getCategories(type: 'income' | 'expense'): string[] {
    return Object.keys(type === 'income'
      ? this.incomeTotals
      : this.expenseTotals);
  }
}
