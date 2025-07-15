import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  @Input() isVisible = false;
  @Output() closeCalculator = new EventEmitter<void>();

  display: string = '0';
  firstOperand: number | null = null;
  operator: string | null = null;
  waitingForSecondOperand: boolean = false;

  appendNumber(num: string): void {
    if (this.waitingForSecondOperand) {
      this.display = num;
      this.waitingForSecondOperand = false;
    } else {
      this.display = this.display === '0' ? num : this.display + num;
    }
  }

  appendOperator(op: string): void {
    if (op === '%') {
      this.calculatePercentage();
      return;
    }

    if (this.firstOperand === null) {
      this.firstOperand = parseFloat(this.display);
    } else if (this.operator) {
      const result = this.calculate();
      this.display = String(result);
      this.firstOperand = result;
    }
    this.operator = op;
    this.waitingForSecondOperand = true;
  }

  calculatePercentage(): void {
    const currentValue = parseFloat(this.display);
    if (this.firstOperand === null) {
      this.display = String(currentValue / 100);
    } else if (this.operator) {
      let result: number;
      const percentage = (this.firstOperand * currentValue) / 100;

      switch (this.operator) {
        case '+':
          result = this.firstOperand + percentage;
          break;
        case '-':
          result = this.firstOperand - percentage;
          break;
        case '*':
          result = percentage;
          break;
        case '/':
          result = this.firstOperand / (currentValue / 100);
          break;
        default:
          result = percentage;
      }
      this.display = String(result);
      this.firstOperand = null;
      this.operator = null;
      this.waitingForSecondOperand = false;
    }
  }

  calculate(): number {
    const secondOperand = parseFloat(this.display);
    let result: number = 0;

    if (this.operator && this.firstOperand !== null) {
      switch (this.operator) {
        case '+':
          result = this.firstOperand + secondOperand;
          break;
        case '-':
          result = this.firstOperand - secondOperand;
          break;
        case '*':
          result = this.firstOperand * secondOperand;
          break;
        case '/':
          result = this.firstOperand / secondOperand;
          break;
      }
      this.display = String(result);
      this.firstOperand = null;
      this.operator = null;
      this.waitingForSecondOperand = false;
    }
    return result;
  }

  clear(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }

  delete(): void {
    if (this.display.length > 1) {
      this.display = this.display.slice(0, -1);
    } else {
      this.display = '0';
    }
  }

  close(): void {
    this.closeCalculator.emit();
  }
}
