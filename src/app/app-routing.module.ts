import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';



const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch:'full' },
  { path:'new-list', component: NewListComponent },
  { path: 'lists/:listId/new-task', component: NewTaskComponent },

  { path:'lists', component: TaskViewComponent},
  { path:'lists/:listId', component: TaskViewComponent},
  { path:'login', component: LogInPageComponent },
  { path:'signup', component: SignupPageComponent },
  { path:'edit/:listId', component:EditListComponent },
  { path:'lists/:listId/edit-task/:taskId', component: EditTaskComponent }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
