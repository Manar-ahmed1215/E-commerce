import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  private readonly formBuilder = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly toastrService = inject(ToastrService)
  private readonly router = inject(Router)
  isLoading = signal<boolean>(false)

  registerForm: FormGroup = this.formBuilder.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    rePassword: ["", [Validators.required]],
    phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
  }
    , { validators: this.confirmPassword }
  )

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value
    const rePassword = group.get('rePassword')?.value
    if (rePassword !== password && rePassword !== "") {
      group.get('rePassword')?.setErrors({ mismatch: true })
      return { mismatch: true }
    }
    return null
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === 'success') {
            this.toastrService.success('Account Created Successfully!', 'FreshCart');
            this.router.navigate(["/login"]);
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
          this.toastrService.error(err.error.message, 'FreshCart');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.toastrService.warning('Please fill all required fields correctly', 'Validation');
    }
  }
}
