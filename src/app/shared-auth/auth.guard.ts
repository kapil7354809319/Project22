import { CanActivateFn, Router } from '@angular/router';
import { UserCookiesService } from '../services/user-cookies.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let userCookieService = inject(UserCookiesService);
  let _router = inject(Router);
  if(userCookieService.checkCookie('CurrentUser')){
    return true;
  } else{
    _router.navigate(['/login']);
    return false;
  }  
};
