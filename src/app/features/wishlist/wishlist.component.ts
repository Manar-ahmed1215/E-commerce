import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { WishListService } from '../../core/services/wish-list.service';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishListService = inject(WishListService)
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID)
  cartIds = signal<string[]>([]);
  loadingAddProduct = signal<string | null>(null);
  isLoading=signal<boolean>(false)
  isLoadingRemove=signal<string | null>(null)
 
  wishListProduct = signal<Product[]>([])
wishCount = signal<number>(this.wishListService.wishListCount())


  ngOnInit(): void {
  if (isPlatformBrowser(this.pLATFORM_ID)) {
    const token = localStorage.getItem('token');

    if (token) {
      this.getLoggedWishlist();
      this.getCartIds();
    } else {
      this.isLoading.set(false);
      this.wishListProduct.set([]);
    }
  }
}
  getLoggedWishlist(): void {
    this.isLoading.set(true)
    this.wishListService.getLoggedWishlist().subscribe({
      next: (res) => {
        this.wishListProduct.set(res.data)
        this.isLoading.set(false)

      },
      error: () => {
        this.isLoading.set(false)

      }
    })
  }
  getCartIds(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        const ids = res.data.products.map((item: any) => item.product._id);
        this.cartIds.set(ids);


      }
    })
  }
  addToCart(productId: string): void {
    this.loadingAddProduct.set(productId)
    if (isPlatformBrowser(this.pLATFORM_ID)){
       if (localStorage.getItem('token')) {
      this.cartService.addProductToCart(productId).subscribe({
        next: (res) => {
          // console.log(res)
          this.cartService.cartCount.set(res.numOfCartItems)
          this.toastrService.success(res.message, 'FreshCart')
          this.getCartIds()
          this.loadingAddProduct.set(null)
        },
        error: (err) => {
          console.log(err)
          this.loadingAddProduct.set(null)
        }
      })
    }
    }
   
    else {
      this.toastrService.warning('Login Frist', 'FreshCart')
    }
  }
 removeToWishList(id: string): void {
  this.isLoadingRemove.set(id); 
  this.wishListService.removeProductFromWishlist(id).subscribe({
    next: (res) => {
      this.wishListService.wishlistIds.set(res.data);
      this.wishListProduct.update(products => products.filter(item => item._id !== id));
      this.wishListService.wishListCount.set(res.data.length);
      this.wishCount.set(res.data.length);
      this.toastrService.warning(res.message, 'FreshCart');
      this.isLoadingRemove.set(null);
    },
    error: () => {
      this.isLoadingRemove.set(null);
    }
  });
}
}
