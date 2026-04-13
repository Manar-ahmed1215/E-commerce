import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private readonly httpClient = inject(HttpClient)
   private readonly router = inject(Router)
   isLogged = signal<boolean>(false)

  signUp(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl +`/api/v1/auth/signup` , data)
  }
  signIn(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl +`/api/v1/auth/signin` , data)
  }
  signOut():void{
    localStorage.removeItem('token')
    this.isLogged.set(false)
    this.router.navigate(["/"])
  }
  forgotPassword(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl +`/api/v1/auth/forgotPasswords` , data)
  }
  verifyCode(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl +`/api/v1/auth/verifyResetCode` , data)
  }
  resetPassword(data:object):Observable<any>{
    return this.httpClient.put(environment.baseUrl +`/api/v1/auth/resetPassword` , data)
  }
  updateUserData(data:object):Observable<any>{
    return this.httpClient.put(environment.baseUrl +`/api/v1/users/updateMe/` , data)
  }
  updatePassword(data:object):Observable<any>{
    return this.httpClient.put(environment.baseUrl +`/api/v1/users/changeMyPassword` , data)
  }
  
}
