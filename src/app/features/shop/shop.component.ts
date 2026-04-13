import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CardComponent } from "../../shared/ui/card/card.component";
import { Product } from '../../core/models/product.interface';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-shop',
  imports: [RouterLink, RouterLinkActive, CardComponent, NgxPaginationModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private readonly productsService = inject(ProductsService)
  private readonly router= inject(Router)
  productList = signal<Product[]>([])
  pageSize = signal<number>(0)
  cp = signal<number>(0)
  total = signal<number>(0)
  isloading=signal<boolean>(false)
  ngOnInit(): void {
    this.getProductsData()
  }
  getProductsData(): void {
    this.isloading.set(true)
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        // console.log("pro",res.data)
        this.productList.set(res.data)
        this.pageSize.set(res.metadata.limit)
        this.cp.set(res.metadata.currentPage)
        this.total.set(res.results)
        this.isloading.set(false)
      },
      error: (err) => {
        console.log(err)
        this.isloading.set(false)
      }
    })
  }
  pageChanged(num: number): void {
    this.productsService.getAllProducts(num).subscribe({
      next: (res) => {
        console.log(res)
        this.productList.set(res.data)
        this.pageSize.set(res.metadata.limit)
        this.cp.set(res.metadata.currentPage)
        this.total.set(res.results)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
 p = signal<number>(1);

  onPageChange(event: any) {
    this.p.set(event);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  backToHome():void{
    this.router.navigate(["/"])
  }
}
