import { Component } from '@angular/core';
import { TransactionTableComponent } from "../../shared/transaction/transaction-table/transaction-table.component";
import { CalculatorComponent } from '../../shared/calculator/calculator.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    TransactionTableComponent
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
}
