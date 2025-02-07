import { Component } from '@angular/core';
import {TransactionComponent} from "../../layout/components/transaction/transaction.component";

@Component({
  selector: 'app-expenses',
    imports: [
        TransactionComponent
    ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {

}
