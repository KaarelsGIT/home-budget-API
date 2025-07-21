import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { TransactionService } from '../../../services/transaction.service';

interface Transaction {
  amount: number;
  date: string;
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
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpense: number = 0;
  balance: number = 0;
  monthlyData: Record<string, number[]> = {};

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const defaultFilters = {
      page: 0, // Spring Boot pages start from 0
      size: 1000,
      sortBy: 'date',
      sortOrder: 'desc'
    };

    this.transactionService.getTransactions('income', defaultFilters).subscribe({
      next: (response: TransactionResponse) => {
        const transactions = response.transactionPage.content;
        this.totalIncome = response.allTotal;
        this.updateBalance();
        this.updateMonthlyChart('income', transactions);
      },
      error: (error) => {
        console.error('Error fetching incomes:', error);
      }
    });

    this.transactionService.getTransactions('expense', defaultFilters).subscribe({
      next: (response: TransactionResponse) => {
        const transactions = response.transactionPage.content;
        this.totalExpense = response.allTotal;
        this.updateBalance();
        this.updateMonthlyChart('expense', transactions);
      },
      error: (error) => {
        console.error('Error fetching expenses:', error);
      }
    });
  }

  private updateBalance(): void {
    this.balance = this.totalIncome - this.totalExpense;
  }

  private updateMonthlyChart(type: string, transactions: Transaction[]): void {
    const monthlyTotals = this.calculateMonthlyTotals(transactions);
    this.monthlyData[type] = monthlyTotals;

    if (this.monthlyData['income'] && this.monthlyData['expense']) {
      this.createChart();
    }
  }

  private calculateMonthlyTotals(transactions: Transaction[]): number[] {
    const monthlyTotals = new Array(12).fill(0);

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth();
      monthlyTotals[month] += Number(transaction.amount); // Convert BigDecimal to number
    });

    return monthlyTotals;
  }

  private createChart(): void {
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
}
