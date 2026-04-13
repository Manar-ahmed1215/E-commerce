import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CategoriesService } from '../../core/services/categories.service';
import {  Category } from '../cart/models/cart.interface';
import { NgxPaginationModule } from "ngx-pagination";
import { CardComponent } from "../../shared/ui/card/card.component";
import { Product } from '../../core/models/product.interface';

@Component({
  selector: 'app-product-on-subcategory',
  imports: [RouterLink, RouterLinkActive, NgxPaginationModule, CardComponent],
  templateUrl: './product-on-subcategory.component.html',
  styleUrl: './product-on-subcategory.component.css',
})
export class ProductOnSubcategoryComponent implements OnInit{
  private readonly categoriesService = inject(CategoriesService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router= inject(Router)
  product = signal<Product[]>([]);
  categoryDetails = signal<Category>({} as Category);
  isLoading = signal<boolean>(false);
  p = signal<number>(1);
  pageSize = signal<number>(0);
  total = signal<number>(0);
  currentId: string = ''; 

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.currentId = params.get('id')!;
        this.p.set(1); 
        this.getAllProductsOnSubategory(this.currentId);
        this.getCategoryDetails(this.currentId);
      }
    });
  }

  getAllProductsOnSubategory(id: string, page: number = 1): void {
    this.isLoading.set(true);
    this.categoriesService.getProductsOnSubcategory(id, page).subscribe({
      next: (res) => {
        // console.log("prooncat" ,res);
        
        this.product.set(res.data);
        this.total.set(res.results);
        this.pageSize.set(res.metadata.limit); 
        this.isLoading.set(false);
      },
      error: () =>{
        this.isLoading.set(false)
      } 
    });
  }

  onPageChange(event: number) {
    this.p.set(event);
    this.getAllProductsOnSubategory(this.currentId, event); 
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  getCategoryDetails(id: string): void {
    this.isLoading.set(true)
    this.categoriesService.getSpecificSubcategories(id).subscribe({
      next: (res) =>{
        this.categoryDetails.set(res.data)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.log(err)
        this.isLoading.set(false)
      }
    });
  }
  backToHome():void{
    this.router.navigate(["/"])
  }
}
