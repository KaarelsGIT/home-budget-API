import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TransactionService} from '../../services/transaction.service';
import {FormsModule} from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-form',
  imports: [
    FormsModule,
    TitleCasePipe
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent {
  @Input() type!: 'income' | 'expense';
  @Output() transactionAdded = new EventEmitter<void>();

  transaction = {
    user: null,
    category: null,
    amount: null,
    date: '',
    description: ''
  };

  constructor(private transactionService: TransactionService) {
  }

  addTransaction(): void {
    if (!this.transaction.amount || !this.transaction.date) {
      alert('Amount and Date are required!');
      return;
    }

    this.transactionService.addTransaction(this.type, this.transaction).subscribe({
      next: () => {
        alert(`${this.type} added successfully!`);
        this.transactionAdded.emit();
        this.transaction = {user: null, category: null, amount: null, date: '', description: ''};
      },
      error: (err) => {
        console.error('Error adding transaction:', err);
        alert('Failed to add transaction.');
      }
    });
  }
}
