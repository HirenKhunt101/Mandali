import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserData } from '../UserData/userdata';

@Injectable({
  providedIn: 'root',
})
export class LoginAuthGuard implements CanActivate, CanLoad {
  constructor(private _Router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.getUser();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.getUser();
  }

  getUser(): boolean {
    try {
      let u = new UserData();
      let data: any = u.getData('userdata');
      // console.log(data);
      if (
        data.user.UserType === 'admin' ||
        data.user.UserType == 'member'
      ) {
        return true;
      } else {
        this._Router.navigateByUrl('/login');
        return false;
      }
    } catch (e) {
      this._Router.navigateByUrl('/login');
      return false;
    }
  }
}
