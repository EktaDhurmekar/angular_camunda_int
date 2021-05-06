import { Component, HostListener, OnDestroy } from '@angular/core';
import { AlertService } from '../alerts/alert/alert.service';
import { CreateProcessService } from '../create-process/create-process.service';
import { DataService } from '../services/data.service';
import { TasklistService } from './tasklist.service';

@Component({
  selector: 'tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnDestroy{

  currentTaskList:CamundaTask[] | any = [];

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    //this.saveTaskList();
}

  constructor(private tasklistService: TasklistService,    
    private alertService: AlertService,
    private dataService: DataService,
    private processService: CreateProcessService) {
    this.getList();
  }

  ngOnDestroy(){
   // this.saveTaskList();
   this.alertService.clear();
  }

  readTaskList(){
    if(localStorage.getItem("taskList") != undefined){
      let tasklistString: string | null = localStorage.getItem("taskList");
      let tasklist:[] = JSON.parse((tasklistString !=null) ? tasklistString : '[]');

      if(tasklist.length >0)
        tasklist.forEach(element => {
          this.currentTaskList.push(element)
        });
    }
  }

  saveTaskList(){
    console.log("saving list in localstorage")
    localStorage.setItem("taskList",JSON.stringify(this.currentTaskList))
  }

  complete(id:string){

    this.tasklistService.complete(id).subscribe(
      data=>{
          this.currentTaskList.forEach((task: CamundaTask) => {
            if(task.id == id)
              this.alertService.success(`Task ${task.name} is complete`)
          });

          this.getList();

      },
      err=>{
        console.log("Error while completing task -> ",err)
      });

  }

  delete(processDefinitionId:string){
    
    this.currentTaskList.forEach((task: CamundaTask,i: number) => {
      if(task.processDefinitionId == processDefinitionId){
        this.processService.deleteProcessDefinition(processDefinitionId).subscribe(
          data=>{
            this.alertService.success(`Task ${task.name} has been deleted successfully`)
            this.currentTaskList.splice(i,1);
            this.dataService.senData({processDefinitionId: task.processDefinitionId})
          },
          err=>{
            this.alertService.error(err.error.message)
          }
        );
      }
    });
  }

  getList(){
    this.tasklistService.getList().subscribe(
      data=>{
        this.currentTaskList = data;
        this.currentTaskList.forEach((e : CamundaTask) => {
          e.isActive = true;
        });
      },
      err=>{
        
      }
    );
  }

}

interface CamundaTask{
  id:string;
  name:string;
  created:string;
  isActive:boolean;
  processDefinitionId:string;
  processInstanceId:string
}