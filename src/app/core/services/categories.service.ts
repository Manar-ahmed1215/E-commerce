import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient)

  getAllCategories():Observable<any>{
    return this.httpClient.get(environment.baseUrl +`/api/v1/categories`)
  }
  getSpecificCategories(categoryId:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl +`/api/v1/categories/${categoryId}`)
  }
  getSpecificSubcategories(categoryId:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl +`/api/v1/subcategories/${categoryId}`)
  }
  getSubCategoriesOnCategory(categoryId:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl +`/api/v1/categories/${categoryId}/subcategories`)
  }
 getProductsOnCategory(categoryId: string, pageNum: number = 1): Observable<any> {
  return this.httpClient.get(`${environment.baseUrl}/api/v1/products?category=${categoryId}&page=${pageNum}`);
}
 getProductsOnSubcategory(categoryId: string, pageNum: number = 1): Observable<any> {
  return this.httpClient.get(`${environment.baseUrl}/api/v1/products?subcategory=${categoryId}&page=${pageNum}`);
}
}
