import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {MonthDropdownComponent} from '../month-dropdown/month-dropdown.component';
import {UserDropdownComponent} from '../user-dropdown/user-dropdown.component';
import {CategoryDropdownComponent} from '../category-dropdown/category-dropdown.component';

@Component({
  selector: 'app-transaction-filter',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    MonthDropdownComponent,
    UserDropdownComponent,
    CategoryDropdownComponent
  ],
  templateUrl: './transaction-filter.component.html',
  styleUrl: './transaction-filter.component.css'
})
export class TransactionFilterComponent {
  @Input() filters!: any;
  @Input() years!: number[];
  @Input() type!: 'income' | 'expense';

  @Output() filtersChange = new EventEmitter<any>();

  applyFilters() {
    this.filtersChange.emit(this.filters);
  }

  onUserChange(userId: string | number | null) {
    this.filters.userId = userId;
    this.applyFilters();
  }

  onCategoryChange(categoryId: number | string | null) {
    this.filters.categoryId = categoryId;
    this.applyFilters();
  }

  onMonthChange(month: number | null) {
    this.filters.month = month;
    this.applyFilters();
  }
}
