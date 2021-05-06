import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateProcessService {
  private baseUrl = 'http://127.0.0.1:8080/engine-rest';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('upload', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/deployment/create`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  start(key:string){   
   return this.http.post(`${this.baseUrl}/process-definition/key/${key}/start`,{})
  }

  deleteDeployment(deploymentId:string){
    return this.http.delete(`${this.baseUrl}/deployment/${deploymentId}?cascade=true`)
  }

  deleteProcessDefinition(definitionId:string){
    return this.http.delete(`${this.baseUrl}/process-definition/${definitionId}?cascade=true`)
  }

  getProcessDefinitionList(){   
    return this.http.get(`${this.baseUrl}/process-definition`)
   }

  getDeploymentList(){   
    return this.http.get(`${this.baseUrl}/deployment`)
   }

}