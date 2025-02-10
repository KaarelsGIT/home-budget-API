import { Component } from '@angular/core';
import {TransactionFormComponent} from '../../components/transaction-form/transaction-form.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    TransactionFormComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
