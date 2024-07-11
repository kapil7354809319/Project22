import { CanActivateFn, Router } from '@angular/router';
import { UserCookiesService } from '../services/user-cookies.service';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

export const accessPermissionGuard: CanActivateFn = (route, state) => {
  const RoutingLevel = route.data['level'];
  let Level1 = environment.Level1; // it's reprsent Level 5
  let Level2 = environment.Level2; // it's reprsent Level 2
  let userCookieService = inject(UserCookiesService);
  let _router = inject(Router);
  let currentUser = userCookieService.getCookie('CurrentUser');
  if (Level1 == currentUser.userRolename) { //checking Level 5 == current user level
    return true;
  } else {
    if (RoutingLevel !== Level2) {
      _router.navigate(['/administrator']);
      return false;
    }
    return true;
  }
};
