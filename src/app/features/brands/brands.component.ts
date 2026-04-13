import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { BrandsService } from '../../core/services/brands.service';
import { Category } from '../../core/models/category.interface';
import { Product } from '../../core/models/product.interface';
import { NgxPaginationModule } from "ngx-pagination";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-brands',
  imports: [RouterLink, RouterLinkActive, NgxPaginationModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit{
  private readonly brandsService = inject(BrandsService)
  private readonly router= inject(Router)
  private readonly pLATFORM_ID = inject(PLATFORM_ID)
  brands = signal<Category[]>([])
  isLoading = signal<boolean>(false)
  pageSize = signal<number>(0);
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);
  ngOnInit(): void {
      this.getBrandsData(1)
  }
getBrandsData(page: number): void {
    this.isLoading.set(true);
    this.brandsService.getAllBrands(page).subscribe({
      next: (res) => {
        this.brands.set(res.data);
        this.pageSize.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.totalItems.set(res.results);
        this.isLoading.set(false);
        if (isPlatformBrowser(this.pLATFORM_ID)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(event: number): void {
    this.getBrandsData(event);
  }
  backToHome():void{
    this.router.navigate(["/"])
  }
}
