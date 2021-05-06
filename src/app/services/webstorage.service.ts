import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {

  constructor() { }

  public saveData = (key:string, data:string): void =>{
      localStorage.setItem(key,data);    
  }

  public getData = (key:string): string | null=>{
    return localStorage.getItem(key);
  }
  
  public removeData = (key:string): void=>{
    localStorage.removeItem(key);
  }
}
