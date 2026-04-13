import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories.service';
import { Category } from '../../../../core/models/product.interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-categories',
  imports: [RouterLink],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.css',
})
export class HomeCategoriesComponent implements OnInit{
  private readonly categoriesService = inject(CategoriesService)
  CategoriesList = signal<Category[]>([])
  ngOnInit(): void {
      this.getCategoriesData()
  }
  getCategoriesData():void{
    this.categoriesService.getAllCategories().subscribe({
      next:(res)=>{
        // console.log(res , "cat")
        this.CategoriesList.set(res.data)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }


}
