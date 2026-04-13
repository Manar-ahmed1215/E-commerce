import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ActivatedRoute, Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { Product } from '../../core/models/product.interface';
import { CardComponent } from "../../shared/ui/card/card.component";
import { Category } from '../../core/models/category.interface';
import { NgxPaginationModule } from "ngx-pagination";

@Component({
  selector: 'app-product-on-category',
  imports: [RouterLinkActive, RouterLinkWithHref, CardComponent, NgxPaginationModule],
  templateUrl: './product-on-category.component.html',
  styleUrl: './product-on-category.component.css',
})
export class ProductOnCategoryComponent implements OnInit {
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
        this.getAllProductsOnCategory(this.currentId);
        this.getCategoryDetails(this.currentId);
      }
    });
  }

  getAllProductsOnCategory(id: string, page: number = 1): void {
    this.isLoading.set(true);
    this.categoriesService.getProductsOnCategory(id, page).subscribe({
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
    this.getAllProductsOnCategory(this.currentId, event); 
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  getCategoryDetails(id: string): void {
    this.isLoading.set(true)
    this.categoriesService.getSpecificCategories(id).subscribe({
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
