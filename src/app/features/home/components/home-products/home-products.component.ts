import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.interface';
import { RouterLink } from "@angular/router";
import { CardComponent } from "../../../../shared/ui/card/card.component";
import { isPlatformBrowser } from '@angular/common';
import { WishListService } from '../../../../core/services/wish-list.service';

@Component({
  selector: 'app-home-products',
  imports: [RouterLink, CardComponent],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css',
})
export class HomeProductsComponent implements OnInit{
  private readonly productsService = inject(ProductsService)
   private readonly wishListService = inject(WishListService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  productList =signal<Product[]>([])
  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.wishListService.getLoggedWishlist().subscribe({
        next: (res) => {
          const ids = res.data.map((item: any) => item._id);
          this.wishListService.wishlistIds.set(ids);
        }
      });
    }
      this.getProductsData()
  }
  getProductsData(){
    this.productsService.getAllProducts().subscribe({
      next:(res)=>{
        console.log('prod',res)
        this.productList.set(res.data)
        
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

 
}
