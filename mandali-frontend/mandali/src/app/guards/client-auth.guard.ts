import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  Route,
  UrlSegment,
  Router,
} from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { UserData } from '../UserData/userdata';

@Injectable({
  providedIn: 'root',
})
export class ClientAuthGuard implements CanLoad, CanActivate {
  constructor(private Router: Router, private location: Location) {
    sessionStorage.setItem('Requested', this.location.path());
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.getUser();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.getUser();
  }
  getUser(): boolean {
    try {
      let u = new UserData();
      let data:any = u.getData('userdata');
      console.log(data);
      if (data.user) {
        return true;
      } else {
        this.Router.navigateByUrl('/login');
        return false;
      }
    } catch (e) {
      this.Router.navigateByUrl('/login');
      return false;
    }
  }
}
