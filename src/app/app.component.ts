import { Component, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { merge, Observable } from 'rxjs';

import { User } from './shared/interfaces';
import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnChanges {

  currentUser: any;
  loggedIn: boolean = false;
  constructor(public authService: AuthService) {
    this.loggedIn = this.authService.isLoggedin();
  }

  ngOnChanges() {
    this.loggedIn = this.authService.isLoggedin();
    console.log(this.loggedIn)
  }
}
