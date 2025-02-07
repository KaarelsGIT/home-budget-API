import { Component } from '@angular/core';
import {TransactionComponent} from "../../layout/components/transaction/transaction.component";

@Component({
  selector: 'app-incomes',
    imports: [
        TransactionComponent
    ],
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.css'
})
export class IncomesComponent {

}
