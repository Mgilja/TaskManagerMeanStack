import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpReqService: HttpRequestService, private http:HttpClient) { }

  getLists() {
    return this.httpReqService.get('lists')
  }

  createList(title:string) {
   return  this.httpReqService.post('lists', {title});
  }

  updateList(title:string, id:string) {
    return this.httpReqService.patch(`lists/${id}`, {title})
  }

 deleteList(listId:string) {
     return this.httpReqService.delete(`lists/${listId}`);
   }

   // TASK PART

   getTasks(listId: string) {
    return this.httpReqService.get(`lists/${listId}/tasks`)
  }
  
   createTasks(title:string, listId: string) {
    // sending a web request to create a task !!!
    return  this.httpReqService.post(`lists/${listId}/tasks`, {title});
   }
   
 
   updateTask(taskId:string, listId:string, title:string) {
     return this.httpReqService.patch(`lists/${listId}/tasks/${taskId}`, {title})

   }
   
   
   

  deleteTask(listId:string, taskId:string) {
     return this.httpReqService.delete(`lists/${listId}/tasks/${taskId}`)
  }
}
