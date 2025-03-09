import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-transaction-update-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './transaction-update-form.component.html',
  styleUrl: './transaction-update-form.component.css'
})
export class TransactionUpdateFormComponent {
  @Input() transaction: any;
}
