import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../../services/transaction.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-year-dropdown',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './year-dropdown.component.html',
  styleUrl: './year-dropdown.component.css'
})
export class YearDropdownComponent implements OnInit {
  @Input() selectedYear: number | null = null;
  @Output() selectedYearChange = new EventEmitter<number | null>();

  years: number[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.fetchYears();
  }

  fetchYears(): void {
    forkJoin({
      incomeYears: this.transactionService.getYears('income'),
      expenseYears: this.transactionService.getYears('expense')
    }).subscribe({
      next: ({ incomeYears, expenseYears }) => {
        const combinedYears = new Set([...incomeYears, ...expenseYears]);
        this.years = Array.from(combinedYears).sort((a, b) => b - a);
      },
      error: (error) => console.error('Error fetching years:', error)
    });
  }

  onYearChange(value: any): void {
    const year = value ? Number(value) : null;
    this.selectedYearChange.emit(year);
  }
}
