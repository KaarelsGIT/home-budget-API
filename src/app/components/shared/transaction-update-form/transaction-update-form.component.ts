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

  isLoading = false;

  onSave() {
    if (this.isLoading) return; // Prevent multiple submissions

    this.isLoading = true;
    this.save.emit(this.transaction);
    // The loading state will be reset when the modal is closed
  }

  onClose() {
    this.isLoading = false;
    this.close.emit();
  }

}
