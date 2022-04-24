import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { TaskService } from 'src/app/task.service';






@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent implements OnInit {

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private http:HttpClient) { }
  listId:string
  
  
  ngOnInit(): void {
      this.route.params.subscribe(
        (params: Params) => {
          this.listId = params.listId
        
         console.log(this.listId);
       })
     }
     
     

      updateListClick(title:string) {
       console.log(title);
       let list : List = {
         title:title,
         _id:this.listId
       }
        
       this.http.patch('http://localhost:3000/lists/' + this.listId, list).subscribe((res)=> {
         console.log(res);
         
              this.router.navigate(["/lists", this.listId])
       })
       
      
         
    }
}
