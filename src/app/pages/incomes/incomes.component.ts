import { Component } from '@angular/core';
import {TransactionComponent} from "../../components/transaction/transaction.component";

@Component({
  selector: 'app-incomes',
  standalone: true,
    imports: [
        TransactionComponent
    ],
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.css'
})
export class IncomesComponent {

}
