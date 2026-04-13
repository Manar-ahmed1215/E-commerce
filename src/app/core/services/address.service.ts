import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
   private readonly httpClient = inject(HttpClient)
  getAllAddresses():Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/api/v1/addresses`)
  }
  addAddresse(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/addresses` ,data)
  }
  updateAddresse(id:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/api/v1/addresses/${id}`)
  }
  removeAddress(id: string): Observable<any> {
  return this.httpClient.delete(environment.baseUrl + `/api/v1/addresses/${id}`);
}
}
