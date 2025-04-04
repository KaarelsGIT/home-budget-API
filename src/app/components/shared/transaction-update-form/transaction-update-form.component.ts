import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-transaction-update-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './transaction-update-form.component.html',
  styleUrl: './transaction-update-form.component.css'
})
export class TransactionUpdateFormComponent {
  @Input() transaction: any;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  onSave() {
    this.save.emit(this.transaction);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
