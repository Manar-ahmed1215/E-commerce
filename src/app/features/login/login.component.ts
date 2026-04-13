import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly toastrService = inject(ToastrService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  isLoading = signal<boolean>(false)
  loginForm: FormGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
  })


  submitForm(): void {

    if (this.loginForm.valid) {
      this.isLoading.set(true)
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res)
          if (res.message === 'success') {
            if (isPlatformBrowser(this.pLATFORM_ID)) {
              localStorage.setItem('token', res.token)
              localStorage.setItem('userData', JSON.stringify(res.user))
            }

            this.authService.isLogged.set(true)
            this.toastrService.success('Welcome Back to FreshCart!', 'Login Success');
            // console.log(this.authService.isLogged(), "isllllogged")
            this.router.navigate(["/"])
          }
          this.isLoading.set(false)
        },
        error: (err) => {
          console.log(err)
          this.isLoading.set(false)
          this.toastrService.error(err.error.message || 'Login Failed', 'FreshCart');
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched()
      this.toastrService.warning('Please enter a valid email and password', 'Validation');
    }
  }

}
