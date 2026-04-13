import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private readonly httpClient = inject(HttpClient)
  wishlistIds = signal<string[]>([]);
  wishListCount=signal<number>(0)
  getLoggedWishlist(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/wishlist`)
  }
  addProductFromWishlist(id:string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/wishlist`,
      {
        "productId": id
      }
    )
  }
  removeProductFromWishlist(id:string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v1/wishlist/${id}`)
  }

}
