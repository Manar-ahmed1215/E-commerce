import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/models/category.interface';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit{
  private readonly categoriesService = inject(CategoriesService)
  private readonly router= inject(Router)
  categories=signal<Category[]>([])
  ngOnInit(): void {
      this.getAllCategories()
      
  }
  getAllCategories():void{
    this.categoriesService.getAllCategories().subscribe({
      next:(res)=>{
        console.log("catttt" , res)
        this.categories.set(res.data)
      }
    })
  }
  backToHome():void{
    this.router.navigate(["/"])
  }
 
}
