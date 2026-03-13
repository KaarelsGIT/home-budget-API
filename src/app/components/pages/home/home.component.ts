import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';
import { YearDropdownComponent } from '../../shared/transaction/year-dropdown/year-dropdown.component';
import { MonthDropdownComponent, MONTHS } from '../../shared/transaction/month-dropdown/month-dropdown.component';
import { UserDropdownComponent } from '../../shared/user/user-dropdown/user-dropdown.component';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { BudgetSummary, CategorySummary } from '../../../models/budget-summary';
import { ActiveUserService } from '../../../services/active-user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, YearDropdownComponent, MonthDropdownComponent, UserDropdownComponent],
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

  incomeTotals: { [category: string]: CategorySummary } = {};
  expenseTotals: { [category: string]: CategorySummary } = {};

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
  private userSubscription: Subscription | null = null;
  activeUser: User | null = null;

  constructor(
    private transactionService: TransactionService,
    private activeUserService: ActiveUserService
  ) {
    this.resetTotals();
  }

  ngOnInit() {
    this.refreshSubscription = this.transactionService.refreshTransactions$.pipe(skip(1))
      .subscribe(() => this.loadYearData());

    this.userSubscription = this.activeUserService.getActiveUser().subscribe(user => {
      this.activeUser = user;
      this.loadYearData();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) this.refreshSubscription.unsubscribe();
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
    if (this.userSubscription) this.userSubscription.unsubscribe();
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

  onUserChange(userId: string | number | null): void {
    this.activeUserService.setActiveUser(userId);
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
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
    this.resetTotals();

    if (!this.activeUser) {
      return;
    }

    const filters: any = {
      year: this.currentYear
    };
    if (this.selectedMonth) filters.month = this.selectedMonth;
    if (this.activeUser) filters.userId = this.activeUser.id;

    this.dataSubscription = this.transactionService.getSummary(filters).subscribe({
      next: (summary: BudgetSummary) => {
        this.incomeTotals = summary.incomeCategories;
        this.expenseTotals = summary.expenseCategories;
        this.monthlyTotals = {
          income: {},
          expense: {},
          balance: {}
        };

        // Extract monthly totals from summary
        Object.keys(summary.monthlyTotals).forEach(month => {
          this.monthlyTotals.income[month] = summary.monthlyTotals[month].income;
          this.monthlyTotals.expense[month] = summary.monthlyTotals[month].expense;
          this.monthlyTotals.balance[month] = summary.monthlyTotals[month].balance;
        });

        this.totalIncome = summary.totalIncome;
        this.totalExpense = summary.totalExpense;
        this.totalBalance = summary.totalBalance;
      }
    });
  }

  getDisplayedMonths(): string[] {
    return this.selectedMonth ? [this.months[this.selectedMonth - 1]] : this.months;
  }

  getCategories(type: 'income' | 'expense'): string[] {
    // Sort categories alphabetically
    return Object.keys(type === 'income' ? this.incomeTotals : this.expenseTotals)
      .sort((a, b) => a.localeCompare(b));
  }


}
