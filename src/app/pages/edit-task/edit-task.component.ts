import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  taskId: string;
  listId: string;
  constructor(private http:HttpClient,private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskId = params.taskId
        this.listId = params.listId
        console.log(this.taskId, this.listId);
        
        
      }
    )
  }
 updateTaskClick(title:string) {
   console.log(title);
   
   let task : Task = {
     title:title,
     _id:this.taskId,
     _listId:this.listId
   }
   this.http.patch('http://localhost:3000/lists/' + this.listId + '/tasks/' + this.taskId, task).subscribe(()=> {
      this.router.navigate(['/lists', this.listId])
    })
 }

}
