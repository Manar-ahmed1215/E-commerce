import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';
import { CardComponent } from "../../shared/ui/card/card.component";
import { isPlatformBrowser } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CategoriesService } from '../../core/services/categories.service';
import { TermLimitPipe } from '../../shared/pipes/term-limit-pipe';
import { WishListService } from '../../core/services/wish-list.service';
register();

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, RouterLinkActive, CardComponent , TermLimitPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productsService = inject(ProductsService)
  private readonly categoriesService = inject(CategoriesService)
  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID)
   private readonly wishListService = inject(WishListService)
   private readonly router= inject(Router)
  @ViewChild('relatedSwiper') relatedSwiperRef!: ElementRef;
  productDetails = signal<Product>({} as Product)
  isLoadingDeails = signal<boolean>(false)
  selectedQuantity = signal<number>(1)
  categoryId = signal<string>('')
  isloadingAddCart=signal<boolean>(false)
  isloadingAddWish=signal<boolean>(false)
  isInWishlist = computed(() => 
  this.wishListService.wishlistIds().includes(this.productDetails()._id)
);
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getProductsDetails(params.get("id")!)
    })
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      initFlowbite();
    }
  }
  getProductsDetails(id: string): void {
    this.isLoadingDeails.set(true)
    this.productsService.getSpecificProducts(id).subscribe({
      next: (res) => {
        console.log("details" , res)
        this.productDetails.set(res.data);
        const catId = res.data.category?._id || res.data.category;
        if (catId) {
          this.loadProductAndRelated(catId);
        }
        this.isLoadingDeails.set(false);
        setTimeout(() => {
          if (isPlatformBrowser(this.pLATFORM_ID)) {
            initFlowbite();
          }
        }, 0);
      },
      error: (err) => {
        console.log(err)
        this.isLoadingDeails.set(false)
      }
    });
  }
  increment(): void {
    const availableQuantity = this.productDetails().quantity;
    if (this.selectedQuantity() < availableQuantity) {
      this.selectedQuantity.update(value => value + 1);
    }
  }

  decrement(): void {
    if (this.selectedQuantity() > 1) {
      this.selectedQuantity.update(value => value - 1);
    }
  }
  addToCart(productId: string): void {
    this.isloadingAddCart.set(true)
    if (localStorage.getItem('token')) {
      this.cartService.addProductToCart(productId).subscribe({
        next: (res) => {
          this.cartService.cartCount.set(res.numOfCartItems)
          this.toastrService.success(res.message, 'FreshCart')
          this.isloadingAddCart.set(false)
        },
        error: (err) => {
          console.log(err)
          this.isloadingAddCart.set(false)
        }
      })
    }
    else {
      this.toastrService.warning('Login Frist', 'FreshCart')
    }
  }
  relatedProducts = signal<Product[]>([]);
 loadProductAndRelated(id: string) {
  this.categoriesService.getProductsOnCategory(id).subscribe({
    next: (res) => {
      this.relatedProducts.set(res.data);
      
      if (isPlatformBrowser(this.pLATFORM_ID)) {
        setTimeout(() => {
          const swiperEl = this.relatedSwiperRef?.nativeElement;
          if (swiperEl && typeof swiperEl.initialize === 'function') {
            const swiperParams = {
              navigation: {
                nextEl: '.next-related-btn',
                prevEl: '.prev-related-btn',
              },
              slidesPerView: 1.2, 
              spaceBetween: 15,
              breakpoints: {
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 4 }, 
              },
            };
            Object.assign(swiperEl, swiperParams);
            swiperEl.initialize();
          }
        }, 100);
      }
    }
  });
}
  addToWishList(id: string): void {
    if (localStorage.getItem('token')){
      this.isloadingAddWish.set(true);
    this.wishListService.addProductFromWishlist(id).subscribe({
      next: (res) => {
        // console.log("wishlist" , res)
        this.wishListService.wishlistIds.set(res.data);
        this.toastrService.success(res.message, 'FreshCart');
        this.wishListService.wishListCount.set(res.data.length)
        this.isloadingAddWish.set(false);
      },
      error:()=>{
        this.isloadingAddWish.set(false);
      }
    });
    }
    else {
    this.toastrService.warning('Login First', 'FreshCart');
    this.isloadingAddWish.set(false);
  }
  }
  removeToWishList(id: string): void {
    this.isloadingAddWish.set(true);
    this.wishListService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        this.wishListService.wishlistIds.set(res.data);
        this.toastrService.info(res.message, 'FreshCart');
        this.isloadingAddWish.set(false);
      },
      error:()=>{
        this.isloadingAddWish.set(true);
      }
    });
  }
toggleWishlist(id: string): void {
  if (this.isInWishlist()) {
    this.removeToWishList(id);
  } else {
    this.addToWishList(id);
  }
}
backToHome():void{
    this.router.navigate(["/"])
  }
}
