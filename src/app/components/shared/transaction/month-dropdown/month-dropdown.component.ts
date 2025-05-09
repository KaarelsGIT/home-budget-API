import {Component, EventEmitter, Input, numberAttribute, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

export const MONTHS = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 }
];

@Component({
  selector: 'app-month-dropdown',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './month-dropdown.component.html',
  styleUrl: './month-dropdown.component.css'
})
export class MonthDropdownComponent {
  @Input() selectedMonth: number | null = null;
  @Output() selectedMonthChange = new EventEmitter<number | null>();

  months = MONTHS;

  onMonthChange(value: number | string | null): void {
    this.selectedMonth = value ? Number(value) : null;
    this.selectedMonthChange.emit(this.selectedMonth);
  }
}
