import { Component } from '@angular/core';
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
        case '%':
          result = this.firstOperand % secondOperand;
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
}
