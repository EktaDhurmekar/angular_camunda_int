import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { WebStorageService } from '../services/webstorage.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup;

  constructor(private readonly fb: FormBuilder,
    private router : Router,
    private dataService : DataService,
    private webStorage: WebStorageService  ){
    this.dataService.senData({isAuthenticated : false})
    this.form = this.fb.group({
      username: ['', Validators.required],      
      password: ['', Validators.required]
     });
  }

  login(){
    console.log('In login ',this.form);
    if(this.form.valid){
      this.webStorage.saveData('isAuthenticated','true');
      this.dataService.senData({isAuthenticated : true})
      this.router.navigate(['create-process']);
    }
  }
}
