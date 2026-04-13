import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient)
getAllProducts(filterOptions: any = {}): Observable<any> {
  // filterOptions ده هو الأوبجيكت اللي فيه الفلاتر 
  // مثلاً: { category: '123', brand: '456', page: 1 }

  return this.httpClient.get(`${environment.baseUrl}/api/v1/products`, {
    params: filterOptions 
  });
}
  getSpecificProducts(productId:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/api/v1/products/${productId}`)
  }
}
