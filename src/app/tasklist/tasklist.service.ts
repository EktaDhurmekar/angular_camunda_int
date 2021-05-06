import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasklistService {
  private baseUrl = 'http://127.0.0.1:8080/engine-rest';

  constructor(private http: HttpClient) { }

  getList(){
    return this.http.get(`${this.baseUrl}/task`)
  }

  complete(id:string){

    let body = {
      variables:
      {
        weatherCondition :
        {
          value: 'good'        
        }        
      }
    }

    return this.http.post(`${this.baseUrl}/task/${id}/complete`,body)
  }

  delete(id:string){
    return this.http.delete(`${this.baseUrl}/process-definition/${id}?cascade=true`)
  }

}