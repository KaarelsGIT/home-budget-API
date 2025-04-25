import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
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
export class TransactionUpdateFormComponent implements OnChanges {
  @Input() transaction: any;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  isLoading = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      this.isLoading = false;
    }
  }

  onSave() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.save.emit(this.transaction);
  }

  onClose() {
    this.isLoading = false;
    this.close.emit();
  }

}
