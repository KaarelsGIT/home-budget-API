import { Component } from '@angular/core';
import {TransactionTableComponent} from "../../shared/transaction-table/transaction-table.component";

@Component({
  selector: 'app-expenses',
    imports: [
        TransactionTableComponent
    ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {

}
