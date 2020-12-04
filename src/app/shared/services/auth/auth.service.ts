import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY, observable } from 'rxjs';
import { tap, pluck } from 'rxjs/operators';
import { TokenStorage } from './token.storage';
import { User } from '../../interfaces';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private tokenStorage: TokenStorage, private router: Router,
    private toasterService: ToastrService) { }

  login(loginObj): Observable<any> {
    return Observable.create(observer => {
      this.http.post('http://localhost:5000/api/auth/login/', loginObj).subscribe((res: any) => {
        console.log(res);
        this.setUser(res.data)
        this.router.navigateByUrl('')
        observer.complete();
      }), (error: HttpErrorResponse) => {
        observer.next({ error: error });
        observer.complete();
      }
    });
  }

  register(registerObj) {
    return Observable.create(observer => {
      this.http.post('http://localhost:5000/api/auth/register/', registerObj).subscribe((res: any) => {
        console.log(res)
        this.toasterService.success(res.message, 'Registered');
        this.router.navigateByUrl('/login')
        observer.complete();
      }, (err: HttpErrorResponse) => {
        this.toasterService.error(err.error.message, 'Error');
        console.log(err)
      }), (error: HttpErrorResponse) => {
        console.log(error);
        observer.next({ error: error });
        observer.complete();
      }
    });
  }

  isLoggedin() {
    let user = localStorage.getItem('userObject');
    if (user) return true;
    else return false;
  }

  setUser(user) {
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(user), environment.secret_key).toString();
    if (localStorage.getItem('userObject')) {
      localStorage.removeItem('userObject');
    }
    localStorage.setItem('userObject', encrypted);
  }

  decrypt() {
    if (localStorage.getItem('userObject')) {
      let user = localStorage.getItem('userObject');
      let decrypt = CryptoJS.AES.decrypt(user, environment.secret_key).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypt)
    }
  }

  signOut(): void {
    localStorage.removeItem('userObject');
  }

  getAuthorizationHeaders() {
    let user = this.decrypt();
    if (user) {
      let token = user.token;
      return token
    }
  }

}
