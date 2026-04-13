import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  private readonly router= inject(Router)
  backToHome():void{
    this.router.navigate(["/"])
  }
  goBack():void {
  window.history.back();
}
}
