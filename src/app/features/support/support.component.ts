import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-support',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
})
export class SupportComponent {
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService); 
  
  isLoading = signal(false);

  backToHome(): void {
    this.router.navigate(['/']);
  }

  sendMessage(event: Event): void {
    event.preventDefault(); 
    
    this.isLoading.set(true); 
    setTimeout(() => {
      this.isLoading.set(false); 
      this.toastrService.success('Your message has been sent successfully!', 'Success');
      (event.target as HTMLFormElement).reset();
    }, 2000);
  }
}