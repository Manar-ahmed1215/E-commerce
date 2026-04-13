import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient)
  cartCount=signal<number>(0)

  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v2/cart`, {
      "productId": id
    })
  }
  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v2/cart`)
  }
  removeProductItem(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart/${id}`)
  }
  removeAllItems(): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart`)
  }
  udateCartCount(id: string, count: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/api/v2/cart/${id}`,
      {
        "count": count
      }
    )
  }
  createCashOrder(id: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/orders/${id}`, data)
  }
  createVisaOrder(id: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/orders/checkout-session/${id}?url=${environment.url}`, data)
  }


}
