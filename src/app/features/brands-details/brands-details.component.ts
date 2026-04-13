import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { BrandsService } from '../../core/services/brands.service';
import { Category } from '../../core/models/category.interface';

import { CardComponent } from "../../shared/ui/card/card.component";
import { Product } from '../../core/models/product.interface';


@Component({
  selector: 'app-brands-details',
  imports: [RouterLink, RouterLinkActive, CardComponent],
  templateUrl: './brands-details.component.html',
  styleUrl: './brands-details.component.css',
})
export class BrandsDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly brandsService = inject(BrandsService)
  private readonly router= inject(Router)
  brandDetails = signal<Category>({} as Category)
  productsOnBrand = signal<Product[]>([])
  isLoading = signal<boolean>(false)
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getBrandDetails(params.get("id")!)
      this.getProductOnBrand(params.get("id")!)
    })
  }
  getBrandDetails(id: string): void {
    this.isLoading.set(true)
    this.brandsService.getSpecificBrand(id).subscribe({
      next: (res) => {
        // console.log("details", res)
        this.brandDetails.set(res.data)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.log(err)

        this.isLoading.set(false)
      }
    })
  }
  getProductOnBrand(id: string): void {
    this.isLoading.set(true)
    this.brandsService.getProductsOnBrand(id).subscribe({
      next: (res) => {
        this.productsOnBrand.set(res.data)
        this.isLoading.set(false)
      },
      error: () => {
       this.isLoading.set(false)


      }
    })
  }
  backToHome():void{
    this.router.navigate(["/"])
  }
}
