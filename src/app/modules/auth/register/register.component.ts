import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted: boolean = false;
  userForm: FormGroup | undefined;
  uploading: boolean = false;
  constructor(private formBuilder: FormBuilder, private toasterService: ToastrService,
    private authService: AuthService) { }

  get f() {
    return this.userForm.controls;
  }

  ngOnInit(): void {
    this.initUserForm();
  }

  initUserForm() {
    this.userForm = this.formBuilder.group({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm?.invalid) {
      this.uploading = false;
      this.toasterService.error('Fill Form Properly', 'Invalid Form');
      return;
    } else {
      this.addUser(this.userForm.value);
    }
  }

  addUser(user: any) {
    this.authService.register(user).subscribe((res: any) => {
      this.toasterService.success('User Added!', 'Success!');
      console.log(res.data);
      this.userForm.reset();
      this.initUserForm();
    })
  }
}
