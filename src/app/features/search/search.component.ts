import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../cart/models/cart.interface';
import { BrandsService } from '../../core/services/brands.service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CardComponent } from "../../shared/ui/card/card.component";
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from "ngx-pagination";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, CardComponent, FormsModule, NgxPaginationModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly brandsService = inject(BrandsService);
  private readonly productsService = inject(ProductsService); 
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);

  categories = signal<Category[]>([]);
  brands = signal<Category[]>([]);
  productList = signal<Product[]>([]);
  activeFilters = signal<{ key: string, value: string }[]>([]);
  isFilterOpen = signal(false);
  currentPage = 1;
  totalItems = 0;
  pageSize = 0;

  ngOnInit(): void {
    this.getCategortName();
    this.getBrandName();
    this.activatedRoute.queryParams.subscribe(params => {
      this.getFilteredProducts(params);
      this.updateActiveFilters(params);
    });
  }

  updateActiveFilters(params: any): void {
    const filters = Object.keys(params)
      .filter(key => key !== 'page' && params[key]) 
      .map(key => ({ key, value: params[key] }));
    this.activeFilters.set(filters);
  }

getFilteredProducts(params: any): void {
  const queryWithLimit = { ...params, limit: 8 };

  this.productsService.getAllProducts(queryWithLimit).subscribe({
    next: (res) => {
      this.productList.set(res.data);
      this.totalItems = res.results || res.total || res.data.length; 
      this.pageSize = res.metadata?.limit || 10; 
      this.currentPage = res.metadata?.currentPage || Number(params.page) || 1;
    }
  });
}
getFilterName(key: string, value: string): string {
  if (key === 'category') {
    const cat = this.categories().find(c => c._id === value);
    return cat ? cat.name : value;
  }
  if (key === 'brand') {
    const brand = this.brands().find(b => b._id === value);
    return brand ? brand.name : value;
  }
  if (key === 'price[gte]') return `Min: ${value}`;
  if (key === 'price[lte]') return `Max: ${value}`;
  if (key === 'keyword') return `Search: ${value}`;

  return value;
}
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { keyword: value ? value : null, page: 1 }, 
      queryParamsHandling: 'merge'
    });
  }

  toggleFilter(key: string, id: string): void {
    const currentParams = this.activatedRoute.snapshot.queryParams;
    let newValue: string | null = id;

    if (currentParams[key] === id) {
      newValue = null; 
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { [key]: newValue, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  applyPriceFilter(key: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { [key]: value ? value : null, page: 1 },
      queryParamsHandling: 'merge'
    });
  }
  onPageChange(pageNumber: number): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: pageNumber },
      queryParamsHandling: 'merge'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearAllFilters(): void {
    this.router.navigate(['/search']);
  }

  getCategortName(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => this.categories.set(res.data)
    });
  }

  getBrandName(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => this.brands.set(res.data)
    });
  }
onSortChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  this.router.navigate([], {
    relativeTo: this.activatedRoute,
    queryParams: { sort: value ? value : null }, 
    queryParamsHandling: 'merge'
  });
}
toggleFilterMenu() {
  this.isFilterOpen.update(val => !val);
}
backToHome():void{
    this.router.navigate(["/"])
  }
}