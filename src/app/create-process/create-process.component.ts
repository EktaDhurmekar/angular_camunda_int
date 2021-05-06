import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { CreateProcessService } from './create-process.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebStorageService } from '../services/webstorage.service';
import { AlertService } from '../alerts/alert/alert.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'create-process',
  templateUrl: './create-process.component.html',
  styleUrls: ['./create-process.component.css']
})
export class CreateProcessComponent implements OnInit, OnDestroy {

  currentFile?: File;
  progress = 0;
  message = '';
  fileAttr : any = 'choose file'

  processList:CamundaProcess[]=[
    {id:'test:1234', deploymentTime:'1234', name:'test', isStarted: false, version: 1, key:'key', deploymentId:'abc123'}
  ];
  displayedColumns: string[] = ['id', 'deploymentTime', 'name', 'isStarted', 'isStarted'];

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
   // this.saveProcessListToStorage();
}

  constructor(private processService: CreateProcessService,
    private webStorage: WebStorageService,
    private alertService: AlertService) { 
   // this.readProcessListFromStorage();    
  }

  ngOnInit(){
    //this.getNotification();
    this.getProcessDefinitionList();
  }

  ngOnDestroy(){
   // this.saveProcessListToStorage();
   this.alertService.clear();
  }

  // getNotification(){    
  //   this.dataService.getData().subscribe(
  //     data=>{
  //       if(data.hasOwnProperty('processDefinitionId')){
  //         let processDefinitionId =  data['processDefinitionId'];
  //           let index = processDefinitionId.lastIndexOf(':');
  //           let id  = processDefinitionId.substring(index+1)            
  //             this.processService.deleteDeployment(id).subscribe(
  //               res=>{
  //                 this.getProcessDefinitionList();
  //               },
  //               err=>{
  //                 console.log("Error while deleting deployment with id-> "+id)
  //               });
  //       }          
  //     }
  //   );
  // }

  saveProcessListToStorage(){
    console.log('saving list in sessionStorage')
    this.webStorage.saveData('processList', JSON.stringify(this.processList))
  }

  readProcessListFromStorage(){    
    let processListString = this.webStorage.getData('processList');
    
    if(processListString != null){     
      this.processList = JSON.parse((processListString !=null) ? processListString : '[]');
    }
    console.log("processList const-> ",this.processList)
  }


  getProcessDefinitionList(){

    this.processService.getProcessDefinitionList().subscribe(
      data=>{
        let respList: CamundaProcess[] | any = data;
        this.processList = respList
      }
    );

  }

  selectFile(event: any): void {

    let list = Object.assign([],event.target.files)
    this.currentFile = list[0];
    this.fileAttr = this.currentFile?.name
    event.target.value = '';    
  }

  upload(): void {
    this.progress = 0;
    if (this.currentFile) {

        this.processService.upload(this.currentFile).subscribe(        
          (event: any) => {
            console.log('In res-> ' ,event);
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              // this.message = event.body.message;
              // console.log(' res-> ' ,event.body);
              // console.log(' res-> ' ,Object.values(event.body['deployedProcessDefinitions'])[0]);

              // let deploymentDefinition:any = Object.values(event.body['deployedProcessDefinitions'])[0];
              // let process:CamundaProcess = event.body; 
              // process.key = deploymentDefinition['key'];
              // process.name = deploymentDefinition['name'];
              // process.isStarted = false;
              // process.deploymentId = deploymentDefinition['deploymentId'];
              // process.id = deploymentDefinition['id']
              // this.processList.push(process)  

              this.getProcessDefinitionList();

              this.alertService.success('Process created sucessfully')
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;
  
            if (err.error && err.error.message) {
              this.message = err.error.message;
              this.alertService.error(this.message);
            } else {
              this.alertService.error('Could not upload the file!');
            }
          });
      
  
      this.currentFile = undefined;
      this.fileAttr = 'choose file';
    }
  }

  start(id:string){

    this.processList.forEach(process=>{
      if(process.deploymentId == id){
        this.processService.start(process.key).subscribe(
          (data)=>{
            process.isStarted= true;
            this.alertService.success(`Process ${process.name} has started`);
          },
          (err)=>{
            console.log('Error while starting process ',err)
            this.alertService.error( err.error.message);
          }
        );        
      }        
    })

  }

  delete(deploymentId:string){

    this.processList.forEach((process, i)=>{
      if(process.deploymentId == deploymentId){      
      this.processService.deleteDeployment(deploymentId).subscribe(
        res=>{
          this.processList.splice(i,1);
          this.alertService.success(`Process ${process.name} is deleted successfully`);
        },
        err=>{
          this.alertService.error(err.error.message);
        }
      );
           
      }        
    })

  }

}


interface CamundaProcess{

  id:string //processDefinitionId
  deploymentTime:string
  version:number
  deploymentId:string; //id
  name:string
  key:string
  isStarted:boolean
}