import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router } from '@angular/router';
import { onSideNavChange, animateText } from './animations/sidenav.animation'
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  isAuthenticated:boolean = false;
  public sideNavState: boolean = false;

  constructor(private router : Router,
    private dataService : DataService ){
    // this.router.events.subscribe((val) => {
         
    //     if(val instanceof NavigationEnd){
    //       this.isAuthenticated = (localStorage.getItem('isAuthenticated') == 'true') ? true : false ;
    //       if(!this.isAuthenticated)
    //         this.navigateToLogin();
    //       else
    //         this.dataService.senData({isAuthenticated: this.isAuthenticated})
    //     }        
    //   });
  }

  ngOnInit(){

  }

  navigateToLogin(){
    this.router.navigate(['/login']);
  }

}
