import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpRequestService } from './http-request.service';
import { Router } from '@angular/router';
import { shareReplay , tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  constructor(private http: HttpClient, 
    private webService: HttpRequestService, 
    private router:Router 
    ) { }


    logIn(email: string,password: string) {
      return this.webService.logIn({ email, password }).pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => {
           this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
             
        })
     )
   }

   signUp(email: string,password: string) {
    return this.webService.signUp({ email, password }).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
         this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
           
      })
   )
 }
  
  
    // 
   
    private setSession(userId: string, accessToken:string, refreshToken:string) {
      localStorage.setItem('user-id', userId)
      localStorage.setItem('x-access-token', accessToken)
      localStorage.setItem('x-refresh-token', refreshToken)


      
       
      
    }
    private removeSession() {
      localStorage.removeItem('user-id')
      localStorage.removeItem('x-access-token')
      localStorage.removeItem('x-refresh-token')


       
      
    }
    logOut() {
       this.removeSession();
       this.router.navigateByUrl("/login");
    }

    getAccessToken() {
      return localStorage.getItem('x-access-token')
    }

    getRefreshToken() {
      return localStorage.getItem('x-refresh-token')
    }

    setAccessToken(accessToken: string) {
      return localStorage.setItem('x-access-token', accessToken)
      
      
    }
    getUserId(){
      return localStorage.getItem('user-id');
    }

    
   getNewAccessToken() {
     return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
       headers: {
         'x-refresh-token': this.getRefreshToken(),
         '_id': this.getUserId(),
       },
       observe: 'response'

       }).pipe(
         tap((res: HttpResponse<any>)=> {
            this.setAccessToken(res.headers.get('x-access-token'))
         })
       )
   }

}
   

