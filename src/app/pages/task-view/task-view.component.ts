import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';



@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

 lists: List[];
 tasks: Task[];
 selectedListId: string;

  constructor(
    private createTaskService: TaskService, 
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService ) { }
    
 



  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params) => {
        if(params.listId) {
           this.selectedListId = params.listId;
        this.createTaskService.getTasks(params.listId).subscribe((tasks:any)=> {
             this.tasks = tasks;
        })
        } else {
          this.tasks= undefined;
        }
       
      })

    this.createTaskService.getLists().subscribe((lists:any)=> {
      this.lists = lists
    })
  }
//  onTaskClick(task: Task) {
//    this.createTaskService.completed(task).subscribe(()=> {
//      console.log('completed');
//      task.completed = !task.completed;
     
//      })
//    }
 
   onDeleteListClick() {
     this.createTaskService.deleteList(this.selectedListId).subscribe((res)=> {
         this.router.navigate(['/lists'])
         console.log(res);
       
     })
   }
  onDeleteTaskClick(id:string) {
    this.createTaskService.deleteTask(this.selectedListId, id).subscribe((res:any)=> {
      this.tasks = this.tasks.filter(val=> val._id !== id);
      console.log(res, 'successfully deleted');
      
    })

  }
  logOut() {
   this.authService.logOut()
  }
}

