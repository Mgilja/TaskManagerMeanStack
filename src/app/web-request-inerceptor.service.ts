import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { empty, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WebRequestInerceptorService implements HttpInterceptor {

  constructor(private authService: AuthService ) { }
  refreshingAccesToken: boolean;
  accesTokenRefreshed: Subject<any> = new  Subject();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request = this.addAuthHeader(request);

      
      // call next 

      return next.handle(request).pipe(
        catchError((error:HttpErrorResponse)=> {

          // intercerpting 401 stuts and redirecting to login page 
          if (error.status === 401 ) {
            // refreshing access token 
             return this.refreshAccessToken().pipe(
              switchMap(()=> {
                request = this.addAuthHeader(request)
                return next.handle(request);
              }),
              catchError((err:any)=> {
                console.log(err);
                this.authService.logOut();
                return empty();
                
              })
            )
         }
          return throwError(error);

        })
      )
  }


  addAuthHeader(request:HttpRequest<any>) {
    const token = this.authService.getAccessToken()
     
    

    if(token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request
  }

  refreshAccessToken() {
    if(this.refreshingAccesToken) {
      return new Observable (observer => {
        this.accesTokenRefreshed.subscribe(()=> {
          observer.next();
          observer.complete();
        })
      })

    } else {
      this.refreshingAccesToken =  true
       return this.authService.getNewAccessToken().pipe(
      tap(()=> {
        console.log('success, refreshed');
        this.refreshingAccesToken = false;
        this.accesTokenRefreshed.next();
        
        })
      )
    }
  }
}
      

  
