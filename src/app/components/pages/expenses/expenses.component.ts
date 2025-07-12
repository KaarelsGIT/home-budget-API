import {Component} from '@angular/core';
import {TransactionTableComponent} from "../../shared/transaction/transaction-table/transaction-table.component";
import {CalculatorComponent} from '../../shared/calculator/calculator.component';

@Component({
  selector: 'app-expenses',
  imports: [
    TransactionTableComponent,
    CalculatorComponent
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {

}
