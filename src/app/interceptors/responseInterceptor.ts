import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import Cookies from "js-cookie";
import { catchError, throwError } from "rxjs";

export function responseInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  return next(req).pipe(
    catchError(err => {

      if ((err.status === 0 || err.status === 401) && req.url.indexOf("/login") < 0) {
        router.navigate(["/login"])
        Cookies.remove("authorization")
      }
      return throwError(() => err)
    })
  );
}