import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [FormsModule, NgIf, NgStyle],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  @Input() isVisible = false;
  @Output() closeCalculator = new EventEmitter<void>();

  display: string = '0';
  expression: string = '';
  firstOperand: number | null = null;
  operator: string | null = null;
  waitingForSecondOperand: boolean = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isVisible) return;

    event.preventDefault();

    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
      this.appendNumber(key);
      return;
    }

    switch (key) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        this.appendOperator(key);
        break;
      case 'Enter':
      case '=':
        this.calculate();
        break;
      case 'Backspace':
        this.delete();
        break;
      case 'Escape':
        this.close();
        break;
      case 'c':
      case 'C':
        this.clear();
        break;
    }
  }

  appendNumber(num: string): void {
    if (this.waitingForSecondOperand) {
      this.display = num === '.' ? '0.' : num;
      this.expression += this.display;
      this.waitingForSecondOperand = false;
    } else {
      if (num === '.' && !this.display.includes('.')) {
        this.display = this.display + num;
      } else if (num !== '.') {
        this.display = this.display === '0' ? (num === '.' ? '0.' : num) : this.display + num;
      }
      this.expression += num;
    }
  }

  appendOperator(op: string): void {
    if (op === '%') {
      this.handlePercent();
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
    this.expression += op;
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
      this.expression += '=';
      this.firstOperand = null;
      this.operator = null;
      this.waitingForSecondOperand = false;
    }
    return result;
  }

  clear(): void {
    this.display = '0';
    this.expression = '';
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

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    this.onMouseMove(event);
  }

  @HostListener('document:mouseup')
  handleMouseUp() {
    this.onMouseUp();
  }


  dragging = false;
  offsetX = 0;
  offsetY = 0;
  position = { top: 100, left: 100 };

  onMouseDown(event: MouseEvent): void {
    this.dragging = true;
    this.offsetX = event.clientX - this.position.left;
    this.offsetY = event.clientY - this.position.top;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      this.position.left = event.clientX - this.offsetX;
      this.position.top = event.clientY - this.offsetY;
    }
  }

  onMouseUp(): void {
    this.dragging = false;
  }

  handlePercent(): void {
    const value = parseFloat(this.display);
    if (this.firstOperand !== null && this.operator) {
      const percentValue = (this.firstOperand * value) / 100;
      this.display = String(percentValue);
      this.expression += '%';
    } else {
      const percentValue = value / 100;
      this.display = String(percentValue);
      this.expression += '%';
    }
  }
}
