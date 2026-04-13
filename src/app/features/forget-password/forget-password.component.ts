import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  step = signal<number>(1);
  isLoading = signal<boolean>(false);
  msgError = signal<string>(""); 

  email: FormControl = new FormControl("", [Validators.required, Validators.email]);
  code: FormControl = new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{6}$/)]);
  password: FormControl = new FormControl("", [
    Validators.required, 
    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  ]);

  submitEmail(e: Event): void {
    e.preventDefault();
    if (this.email.valid) {
      this.isLoading.set(true);
      this.msgError.set("");
      this.authService.forgotPassword({ email: this.email.value }).subscribe({
        next: (res) => {
          this.step.set(2);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.msgError.set(err.error?.message || "Something went wrong!");
          this.isLoading.set(false);
        }
      });
    }
  }

  submitCode(e: Event): void {
    e.preventDefault();
    if (this.code.valid) {
      this.isLoading.set(true);
      this.msgError.set("");
      this.authService.verifyCode({ resetCode: this.code.value }).subscribe({
        next: (res) => {
          this.step.set(3);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.msgError.set(err.error?.message || "Invalid Code!");
          this.isLoading.set(false);
        }
      });
    }
  }

  submitPassword(e: Event): void {
    e.preventDefault();
    if (this.password.valid) {
      this.isLoading.set(true);
      this.msgError.set("");
      const data = {
        email: this.email.value,
        newPassword: this.password.value
      };
      this.authService.resetPassword(data).subscribe({
        next: (res) => {
          this.router.navigate(['/login']);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.msgError.set(err.error?.message || "Failed to reset password.");
          this.isLoading.set(false);
        }
      });
    }
  }
}