import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  readonly ROOT_URL: any;

  constructor(private http: HttpClient) {
     this.ROOT_URL = 'http://localhost:3000'
   }

   get(uri:string) {
     return this.http.get(`${this.ROOT_URL}/${uri}`);
   }
   
   post(uri:string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
   }
   patch(id:string ,payload: Object) {
    return this.http.patch(`${this.ROOT_URL}/` + id, payload);
   }
   delete(uri:string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`)
  }

  logIn({ email, password }: { email: string, password:string }) {
    return this.http.post(`${this.ROOT_URL}/users/login`, {
      email,
      password,
      
    }, {
      observe:'response'
      });
  }
  signUp({ email, password }: { email: string, password:string }) {
    return this.http.post(`${this.ROOT_URL}/users`, {
      email,
      password,
      
    }, {
      observe:'response'
      });
  }

}
