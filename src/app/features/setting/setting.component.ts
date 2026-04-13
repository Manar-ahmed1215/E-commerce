import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserDetails } from '../../core/models/user-details.interface';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-setting',
  imports: [ReactiveFormsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID)
  userData = signal<UserDetails>({} as UserDetails)
  UpdateForm: FormGroup = this.formBuilder.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
    email: ["", [Validators.required, Validators.email]],
    phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
  })
  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.authService.isLogged.set(true);
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode<UserDetails>(token!);
        this.userData.set(decodedToken)
      }
    }


  }
  submitForm(): void {
    if (this.UpdateForm.valid) {
      this.authService.updateUserData(this.UpdateForm.value).subscribe({
        next: (res) => {
          console.log(res)

        },
        error: (err) => {
          console.log(err)
        }
      })
    }
    else {
      this.UpdateForm.markAllAsTouched()
    }
  }


updatePasswordForm: FormGroup = this.formBuilder.group({
  currentPassword: ["", [Validators.required]], 
  password: ["", [Validators.required, Validators.minLength(6)]],
  rePassword: ["", [Validators.required]]
}, { validators: this.confirmPassword });
 submitPassword(): void {
    if (this.updatePasswordForm.valid) {
      this.authService.updatePassword(this.updatePasswordForm.value).subscribe({
        next: (res) => {
          this.updatePasswordForm.reset(); 
        },
      });
    } else {
      this.updatePasswordForm.markAllAsTouched();
    }
  }
    confirmPassword(group:AbstractControl){
  const password =group.get('password')?.value
  const rePassword =group.get('rePassword')?.value
  if(rePassword !== password && rePassword !== ""){
    group.get('rePassword')?.setErrors({mismatch:true})
    return {mismatch:true}
  }
  return null
}

}
