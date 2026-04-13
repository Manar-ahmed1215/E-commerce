import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Cart } from './models/cart.interface';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService)
  private readonly router = inject(Router)
  private pLATFORM_ID = inject(PLATFORM_ID)
  cartDetails = signal<Cart>({} as Cart)
  isLoading=signal<boolean>(false)
  isLoadingRemove=signal<string | null>(null)
  isLoadingUpdate = signal<string | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getCartData()
    }

  }
  getCartData(): void {
    this.isLoading.set(true)
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        // console.log("cart",res.data)
        this.cartDetails.set(res.data)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.log(err)
        this.isLoading.set(false)
      }
    })
  }

  removeProduct(id: string): void {
    this.isLoadingRemove.set(id)
    this.cartService.removeProductItem(id).subscribe({
      next: (res) => {
        // console.log("remove", res)
        this.cartService.cartCount.set(res.numOfCartItems)
        this.cartDetails.set(res.data)
        this.isLoadingRemove.set(null)

      },
      error: (err) => {
        console.log(err)
        this.isLoadingRemove.set(null)
      }
    })
  }
  removeAllProduct(): void {
    this.cartService.removeAllItems().subscribe({
      next: (res) => {
        console.log("remove", res)
        this.cartService.cartCount.set(res.numOfCartItems)
        this.cartDetails.set(res.data)

      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  goToHome() {
    this.router.navigate(['/']);
  }

update(id: string, count: number): void {
  if (count <= 0) {
    this.removeProduct(id);
    return;
  }

  this.isLoadingUpdate.set(id); 
  this.cartService.udateCartCount(id, count).subscribe({
    next: (res) => {
      this.cartDetails.set(res.data);
      this.isLoadingUpdate.set(null);
    },
    error: (err) => {
      console.log(err);
      this.isLoadingUpdate.set(null);
    }
  });
}
}
