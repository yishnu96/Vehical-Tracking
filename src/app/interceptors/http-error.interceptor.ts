import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
  constructor(private toasterService: ToastrService, private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(this.showSnackBar));
  }

  private showSnackBar = (response: HttpErrorResponse): Observable<never> => {
    console.log(response)
    switch (response.status) {
      case 401:
        this.authService.signOut();
        this.router.navigateByUrl('/login')
        this.toasterService.error(response.error.message, 'Error');
        break;

      default:
        break;
    }

    return throwError(response);
  };
}
