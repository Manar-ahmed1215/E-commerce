import { Component, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from "@angular/router";
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishListService } from '../../../core/services/wish-list.service';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent  {
  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)
  private readonly wishListService = inject(WishListService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  wishlistIds = this.wishListService.wishlistIds;
  readonly Math = Math;
  product = input.required<Product>()
  isLoadingAddCart=signal<string |null>(null)
  isSuccessAdd = signal<string | null>(null);
  isLoadingWishlist = signal<string | null>(null);

 addToCart(productId: string): void {
  this.isLoadingAddCart.set(productId);
  if (isPlatformBrowser(this.pLATFORM_ID)){
      if (localStorage.getItem('token')) {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
        this.toastrService.success(res.message, 'FreshCart');
        this.isLoadingAddCart.set(null);
        this.isSuccessAdd.set(productId);
        setTimeout(() => {
          this.isSuccessAdd.set(null);
        }, 1000);
      },
      error: (err) => {
        console.log(err);
        this.isLoadingAddCart.set(null);
      }
    });
  }

  } else {
    this.toastrService.warning('Login First', 'FreshCart');
    this.isLoadingAddCart.set(null);
  }
}

  addToWishList(id: string): void {
    this.isLoadingWishlist.set(id);
    if (isPlatformBrowser(this.pLATFORM_ID)){
        if (localStorage.getItem('token')){
       this.wishListService.addProductFromWishlist(id).subscribe({
      next: (res) => {
        // console.log("wishlist" , res)
        this.wishListService.wishlistIds.set(res.data);
        this.toastrService.success(res.message, 'FreshCart');
        this.wishListService.wishListCount.set(res.data.length)
        this.isLoadingWishlist.set(null);
      },
      error:()=>{
        this.isLoadingWishlist.set(null);
      }
    });
    }
    }
  
    else {
    this.toastrService.warning('Login First', 'FreshCart');
    this.isLoadingWishlist.set(null);
  }
   
  }


  removeToWishList(id: string): void {
    this.isLoadingWishlist.set(id);
    this.wishListService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        this.wishListService.wishlistIds.set(res.data);
        this.toastrService.warning(res.message, 'FreshCart');
        this.isLoadingWishlist.set(null);
      },
      error:()=>{
        this.isLoadingWishlist.set(null);
      }
    });
  }
}
