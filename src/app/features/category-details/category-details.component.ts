import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/models/product.interface';

@Component({
  selector: 'app-category-details',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css',
})
export class CategoryDetailsComponent implements OnInit{
   private readonly activatedRoute = inject(ActivatedRoute)
  private readonly categoriesService = inject(CategoriesService)
  private readonly router= inject(Router)
  categoryDetails=signal<Category>({} as Category)
  subCategories=signal<Category[]>([])
  categoryId=signal<string>("")
  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe((params)=>{
        this.categoryId.set(params.get("id")!)
        this.getCategoryDetails(params.get("id")!)
        this.getSubCategoriesOnCategory(params.get("id")!)

      })
  }
  getCategoryDetails(id:string):void{
    this.categoriesService.getSpecificCategories(id).subscribe({
      next:(res)=>{
        // console.log(res ,"catdeta")
        this.categoryDetails.set(res.data)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
  getSubCategoriesOnCategory(id:string):void{
    this.categoriesService.getSubCategoriesOnCategory(id).subscribe({
    next:(res)=>{
        // console.log(res ,"subcatdeta")
        this.subCategories.set(res.data)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
  backToHome():void{
    this.router.navigate(["/"])
  }
}
