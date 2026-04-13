import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Cart } from '../cart/models/cart.interface';

@Component({
  selector: 'app-check-out',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css',
})
export class CheckOutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly formBuilder = inject(FormBuilder)
  private readonly cartService = inject(CartService)
  private readonly router = inject(Router)
  cartDetails = signal<Cart>({} as Cart)
  checkOut: FormGroup = this.formBuilder.group({
    shippingAddress: this.formBuilder.group({
      details: ["", [Validators.required]],
      phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: ["", [Validators.required]]
    })
  })
  cartId = signal<string>("")
  flag = signal<string>("cash")
  isLoading=signal<boolean>(false)

  ngOnInit(): void {
    this.getCartId()
    this.getCartData();
  }
  getCartId(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.cartId.set(params.get('id')!)

    })
  }

  submitForm(): void {
    if (this.checkOut.valid) {
      if (this.flag() === 'cash') {
        this.cartService.createCashOrder(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            console.log(res)
            if (res.status === "success") {
              this.router.navigate(["/allorders"])
            }
          }
        })
      }
      else {
        this.cartService.createVisaOrder(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            console.log(res)
            if (res.status === "success") {
              window.open(res.session.url, '_self')
            }
          }
        })
      }
    }
  }
  changeFlag(el: HTMLInputElement): void {
    this.flag.set(el.value)
  }
 getCartData(): void {
  this.isLoading.set(true); 
  this.cartService.getLoggedUserCart().subscribe({
    next: (res) => {
      this.cartDetails.set(res.data);
      this.isLoading.set(false);
    },
    error: (err) => {
      console.log(err);
      this.isLoading.set(false); 
    }
  });
}
}
