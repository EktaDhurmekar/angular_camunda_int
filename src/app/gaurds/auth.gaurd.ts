import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { WebStorageService } from "../services/webstorage.service";


@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private  webStorage: WebStorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
      let isAuthenticated = (this.webStorage.getData('isAuthenticated') == 'true') ? true : false;
      
      console.log('Authguard: isAuthenticated-> '+isAuthenticated)
      if(isAuthenticated)
        return  true;
      else
        return this.router.parseUrl('/login'); 
  }
}