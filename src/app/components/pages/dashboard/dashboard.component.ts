import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { TransactionService } from '../../../services/transaction.service';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule], // Removed unused TransactionTableComponent
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpense: number = 0;
  balance: number = 0;
  monthlyData: Record<string, number[]> = {};
  recentTransactions: Transaction[] = [];
  categoryData: { name: string; total: number }[] = [];
  yearToDateComparison = {
    currentYear: { income: 0, expense: 0 },
    previousYear: { income: 0, expense: 0 }
  };

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const defaultFilters = {
      page: 0,
      size: 1000,
      sortBy: 'date',
      sortOrder: 'desc',
      year: new Date().getFullYear()
    };

    const recentFilters = {
      page: 0,
      size: 5,
      sortBy: 'date',
      sortOrder: 'desc'
    };

    this.loadYearData(defaultFilters.year);
    this.loadYearData(defaultFilters.year - 1);
    this.loadRecentTransactions(recentFilters);
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
        if (year === new Date().getFullYear()) {
          this.totalIncome = response.allTotal;
          this.yearToDateComparison.currentYear.income = response.allTotal;
          this.updateBalance();
          this.updateMonthlyChart('income', transactions);
        } else {
          this.yearToDateComparison.previousYear.income = response.allTotal;
        }
      },
      error: (error) => console.error('Error fetching incomes:', error)
    });

    this.transactionService.getTransactions('expense', filters).subscribe({
      next: (response: TransactionResponse) => {
        const transactions = response.transactionPage.content;
        if (year === new Date().getFullYear()) {
          this.totalExpense = response.allTotal;
          this.yearToDateComparison.currentYear.expense = response.allTotal;
          this.updateBalance();
          this.updateMonthlyChart('expense', transactions);
          this.updateCategoryChart(transactions);
        } else {
          this.yearToDateComparison.previousYear.expense = response.allTotal;
        }
      },
      error: (error) => console.error('Error fetching expenses:', error)
    });
  }

  private loadRecentTransactions(filters: any) {
    this.transactionService.getTransactions('expense', filters).subscribe({
      next: (response: TransactionResponse) => {
        this.recentTransactions = response.transactionPage.content;
      }
    });
  }

  private updateCategoryChart(transactions: Transaction[]) {
    const categoryTotals = new Map<string, number>();

    transactions.forEach(transaction => {
      if (transaction.category) {
        const categoryName = transaction.category.name;
        const currentTotal = categoryTotals.get(categoryName) || 0;
        categoryTotals.set(categoryName, currentTotal + Number(transaction.amount));
      }
    });

    this.categoryData = Array.from(categoryTotals.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    this.createPieChart();
  }

  private createMonthlyChart(): void {
    const ctx = document.getElementById('monthlyChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
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

  private createPieChart(): void {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.categoryData.map(item => item.name),
        datasets: [{
          data: this.categoryData.map(item => item.total),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  }
}
