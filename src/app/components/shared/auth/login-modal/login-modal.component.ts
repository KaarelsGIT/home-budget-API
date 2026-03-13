import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  isLoginMode = true;
  username = '';
  password = '';
  role = 'ROLE_PARENT';
  error = '';
  message = '';

  roles = [
    { value: 'ROLE_PARENT', label: 'Parent' },
    { value: 'ROLE_CHILD', label: 'Child' },
    { value: 'ROLE_ADMIN', label: 'Admin' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.message = '';
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.authService.login(this.username, this.password).subscribe({
        next: (res) => {
          this.closeModal();
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = 'Login failed. Please check your credentials.';
        }
      });
    } else {
      this.authService.register(this.username, this.password, this.role).subscribe({
        next: (user) => {
          this.message = 'Registration successful! You can now log in.';
          this.isLoginMode = true;
        },
        error: (err) => {
          this.error = 'Registration failed. Username might already be taken.';
        }
      });
    }
  }

  closeModal(): void {
    this.isVisible = false;
    this.close.emit();
    this.username = '';
    this.password = '';
    this.error = '';
    this.message = '';
  }
}
