import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dataSubject = new Subject<any>();

  constructor() { }

  public senData = (message:any):void =>{
    this.dataSubject.next(message);
  }

  public getData = ():Observable<any>=>{
    return this.dataSubject.asObservable();
  }
  
}
