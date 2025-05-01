import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf, TitleCasePipe} from '@angular/common';
import {CategoryDropdownComponent} from '../category-dropdown/category-dropdown.component';
import {UserDropdownComponent} from '../user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-transaction-update-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    CategoryDropdownComponent,
    UserDropdownComponent,
    TitleCasePipe
  ],
  templateUrl: './transaction-update-form.component.html',
  styleUrl: './transaction-update-form.component.css'
})
export class TransactionUpdateFormComponent implements OnChanges {
  @Input() type!: 'income' | 'expense';
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

  onCategoryIdChange(categoryId: string | number | null) {
    const parsedId = categoryId !== null ? Number(categoryId) : null;

    if (this.transaction.category) {
      this.transaction.category.id = parsedId;
    } else {
      this.transaction.category = { id: parsedId };
    }
  }

  onUserChange(userId: string | number | null) {
    const parsedId = userId !== null ? Number(userId) : null;

    if (this.transaction.user) {
      this.transaction.user.id = parsedId;
    } else {
      this.transaction.user = { id: parsedId };
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
