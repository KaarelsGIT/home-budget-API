import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {MonthDropdownComponent} from '../month-dropdown/month-dropdown.component';
import {UserDropdownComponent} from '../user-dropdown/user-dropdown.component';
import {CategoryDropdownComponent} from '../category-dropdown/category-dropdown.component';

@Component({
  selector: 'app-filter-transaction',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    UserDropdownComponent,
    CategoryDropdownComponent,
    NgIf,
    MonthDropdownComponent
  ],
  templateUrl: './transaction-filter.component.html',
  styleUrl: './transaction-filter.component.css'
})
export class TransactionFilterComponent {
  @Input() filters!: any;
  @Input() years!: number[];
  @Input() type!: 'income' | 'expense';

  @Output() filtersChange = new EventEmitter<any>();

  @ViewChild(UserDropdownComponent) userDropdownComponent!: UserDropdownComponent;

  isFilterActive(): boolean {
    return this.filters.year || this.filters.month || this.filters.userId || this.filters.categoryId;
  }

  clearFilters(): void {
    this.filters.year = null;
    this.filters.month = null;
    this.filters.userId = null;
    this.filters.categoryId = null;
    this.filtersChange.emit();
    this.userDropdownComponent.fetchUsers();
  }

  onFilterChange(): void {
    this.filtersChange.emit();
  }

  onUserChange(userId: string | number | null): void {
    this.filters.userId = userId;
    this.filtersChange.emit();
  }

  onCategoryChange(categoryId: number | string | null): void {
    this.filters.categoryId = categoryId;
    this.filtersChange.emit();
  }

  onMonthChange(month: number | null): void {
    this.filters.month = month;
    this.filtersChange.emit();
  }
}
