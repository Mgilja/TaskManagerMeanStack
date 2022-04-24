import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskViewComponent } from './pages/task-view/task-view.component';
// for button
import { MatButtonModule} from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewListComponent } from './pages/new-list/new-list.component';
// for reactive forms
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule} from '@angular/material/icon';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { WebRequestInerceptorService } from './web-request-inerceptor.service';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { MatMenuModule } from '@angular/material/menu';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component'











@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewListComponent,
    NewTaskComponent,
    LogInPageComponent,
    SignupPageComponent,
    EditListComponent,
    EditTaskComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    // for reactive form 
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [
    {provide : HTTP_INTERCEPTORS, useClass: WebRequestInerceptorService, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
