import { CanActivateFn, Router } from '@angular/router';
import { UserCookiesService } from '../services/user-cookies.service';
import { inject } from '@angular/core';

export const unauthGuard: CanActivateFn = (route, state) => {
    let userCookieService = inject(UserCookiesService);
    let _router = inject(Router);
    if(userCookieService.checkCookie('CurrentUser')) {
      _router.navigate(['/administrator']);
      return false;
    }else{
      return true;
    } 
};
