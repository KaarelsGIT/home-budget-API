import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { TransactionService } from '../../../services/transaction.service';
import { RouterModule } from '@angular/router';
import { YearDropdownComponent } from '../../shared/transaction/year-dropdown/year-dropdown.component';
import { Subscription } from 'rxjs';

interface Transaction {
  amount: number;
  date: string;
  category?: {
    id: number;
    name: string;
  };
  description?: string;
}

interface TransactionResponse {
  transactionPage: {
    content: Transaction[];
    totalElements: number;
  };
  pageTotal: number;
  allTotal: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, YearDropdownComponent], // Added YearDropdownComponent
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedYear: number = new Date().getFullYear();
  totalIncome: number = 0;
  totalExpense: number = 0;
  balance: number = 0;
  monthlyData: Record<string, number[]> = {};
  recentIncomes: Transaction[] = [];
  recentExpenses: Transaction[] = [];
  categoryData: { name: string; total: number }[] = [];
  yearToDateComparison = {
    currentYear: { income: 0, expense: 0 },
    previousYear: { income: 0, expense: 0 }
  };

  private monthlyChartInstance: Chart | null = null;
  private categoryChartInstance: Chart | null = null;
  private refreshSubscription: Subscription | null = null;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadDashboardData();

    this.refreshSubscription = this.transactionService.refreshTransactions$.subscribe(() => {
      this.loadDashboardData();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadDashboardData() {
    this.monthlyData = {}; // Clear previous data
    const recentFilters = {
      page: 0,
      size: 5,
      sortBy: 'date',
      sortOrder: 'desc'
    };

    this.loadYearData(this.selectedYear);
    this.loadYearData(this.selectedYear - 1);
    this.loadRecentTransactions(recentFilters);
  }

  onYearChange(year: number | null): void {
    if (year) {
      this.selectedYear = year;
      this.loadDashboardData();
    }
  }

  private updateBalance(): void {
    this.balance = this.totalIncome - this.totalExpense;
  }

  private updateMonthlyChart(type: string, transactions: Transaction[]): void {
    const monthlyTotals = this.calculateMonthlyTotals(transactions);
    this.monthlyData[type] = monthlyTotals;

    if (this.monthlyData['income'] && this.monthlyData['expense']) {
      this.createMonthlyChart();
    }
  }

  private calculateMonthlyTotals(transactions: Transaction[]): number[] {
    const monthlyTotals = new Array(12).fill(0);

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth();
      monthlyTotals[month] += Number(transaction.amount);
    });

    return monthlyTotals;
  }

  private loadYearData(year: number) {
    const filters = {
      page: 0,
      size: 1000,
      sortBy: 'date',
      sortOrder: 'desc',
      year: year
    };

    this.transactionService.getTransactions('income', filters).subscribe({
      next: (response: TransactionResponse) => {
        const transactions = response.transactionPage.content;
        if (year === this.selectedYear) {
          this.totalIncome = response.allTotal;
          this.yearToDateComparison.currentYear.income = response.allTotal;
          this.updateBalance();
          this.updateMonthlyChart('income', transactions);
          this.createSummaryPieChart();
        } else {
          this.yearToDateComparison.previousYear.income = response.allTotal;
        }
      },
      error: (error) => console.error('Error fetching incomes:', error)
    });

    this.transactionService.getTransactions('expense', filters).subscribe({
      next: (response: TransactionResponse) => {
        const transactions = response.transactionPage.content;
        if (year === this.selectedYear) {
          this.totalExpense = response.allTotal;
          this.yearToDateComparison.currentYear.expense = response.allTotal;
          this.updateBalance();
          this.updateMonthlyChart('expense', transactions);
          this.createSummaryPieChart();
        } else {
          this.yearToDateComparison.previousYear.expense = response.allTotal;
        }
      },
      error: (error) => console.error('Error fetching expenses:', error)
    });
  }

  private loadRecentTransactions(filters: any) {
    this.transactionService.getTransactions('income', filters).subscribe({
      next: (response: TransactionResponse) => {
        this.recentIncomes = response.transactionPage.content;
      }
    });

    this.transactionService.getTransactions('expense', filters).subscribe({
      next: (response: TransactionResponse) => {
        this.recentExpenses = response.transactionPage.content;
      }
    });
  }

  private createSummaryPieChart(): void {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.categoryChartInstance) {
      this.categoryChartInstance.destroy();
    }

    this.categoryChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          data: [this.totalIncome, this.totalExpense],
          backgroundColor: [
            '#4CAF50', // Green for Income
            '#f44336'  // Red for Expenses
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    });
  }

  private createMonthlyChart(): void {
    const ctx = document.getElementById('monthlyChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.monthlyChartInstance) {
      this.monthlyChartInstance.destroy();
    }

    this.monthlyChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Income',
            data: this.monthlyData['income'],
            borderColor: '#4CAF50',
            tension: 0.1
          },
          {
            label: 'Expenses',
            data: this.monthlyData['expense'],
            borderColor: '#f44336',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
