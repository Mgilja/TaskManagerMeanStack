import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  hide = true;
  
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';

    
  }

  ngOnInit(): void {
  }

  onSignInButtonClicked(email:string, password:string) {
    this.authService.signUp(email, password).subscribe((res: HttpResponse<any>)=> {

      if (res.status === 200) {
         this.router.navigate(['/lists'])
      }
      console.log(res);

      console.log('you created an user ');
      
      })

    }
  }

