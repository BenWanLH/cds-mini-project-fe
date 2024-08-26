import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Cookies from "js-cookie";


export const AuthenticationGuard: CanActivateFn = (route, state) => {
  const authToken = Cookies.get("authorization")
  if (!authToken) {

    const router = inject(Router);

    router.navigate(['/login']);
    return false;
  }

  return true;
};
