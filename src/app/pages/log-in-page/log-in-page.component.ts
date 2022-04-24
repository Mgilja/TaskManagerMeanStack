import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent implements OnInit {
  hide = true;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';

    
  }

  onLogInButtonClicked(email:string, password:string) {
    this.authService.logIn(email, password).subscribe((res: HttpResponse<any>)=> {
      if (res.status === 200){
        this.router.navigate(['/lists'])
      }
      console.log(res);
      console.log('youre logged in');
      
    })

  }
}
