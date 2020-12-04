import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = null;
  password: string = null;
  loginForm: FormGroup;
  submitting: boolean = false;
  uploading: boolean = false;
  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder
    , private toasterService: ToastrService) {
  }

  ngOnInit() {
    this.initLoginForm();
  }

  login() {
    this.submitting = true;
    this.uploading = true;
    if (this.loginForm.invalid) {
      this.uploading = true;
      this.toasterService.error('Error', 'Invalid Form');
      return;
    }
    this.authService.login(this.loginForm.value).subscribe((res) => {
      console.log(res);
      this.router.navigateByUrl('')
    });
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }


}
