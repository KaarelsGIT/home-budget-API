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
  @Input({transform: numberAttribute}) selectedMonth: number | null = null;
  @Output() selectedMonthChange = new EventEmitter<number | null>(); // ✅ Õige nimi

  months = MONTHS;

  onMonthChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedMonthChange.emit(value ? Number(value) : null); // ✅ Õige väärtus
  }

  protected readonly Number = Number;
}
