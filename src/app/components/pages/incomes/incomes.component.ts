import { Component } from '@angular/core';
import {TransactionTableComponent} from "../../shared/transaction/transaction-table/transaction-table.component";

@Component({
  selector: 'app-incomes',
  standalone: true,
    imports: [
        TransactionTableComponent
    ],
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.css'
})
export class IncomesComponent {

}
