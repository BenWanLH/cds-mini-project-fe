import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import Cookies from "js-cookie";

export function requestInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authToken = Cookies.get("authorization")
  const newReq = authToken ? req.clone({
    setHeaders: {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  }) : req

  return next(newReq);
}