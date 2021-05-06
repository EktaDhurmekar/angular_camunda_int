import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { WebStorageService } from 'src/app/services/webstorage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
 
  @Output() public sidenavToggle = new EventEmitter();
  isAuthenticated: boolean = false;   
  dataSubscription: Subscription | undefined;

  constructor(private router : Router,
  private dataService : DataService,
  private webStorage: WebStorageService ) {
    this.isAuthenticated = (this.webStorage.getData('isAuthenticated') == 'true') ? true : false ;
   }
  
  ngOnInit() {
   let authenticationSubscription =  this.dataService.getData().subscribe(
      data=>{
        if(data.hasOwnProperty('isAuthenticated'))
          this.isAuthenticated = data['isAuthenticated'];
      }
    );

    this.dataSubscription?.add(authenticationSubscription);
  }

  ngOnDestroy(){
    if(this.dataSubscription)
     this.dataSubscription.unsubscribe();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  logout(){
    this.webStorage.removeData('isAuthenticated');  
    this.isAuthenticated = false; 
    this.router.navigate(['/login']);
  }

}
