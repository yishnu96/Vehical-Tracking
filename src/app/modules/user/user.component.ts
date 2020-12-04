import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MainService } from 'src/app/shared/services/main.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  allUsers: any[] = [];
  allRoles: any[] = [];
  currentIndex: number = 0;
  currentUserId: string = '';
  currentUser: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: boolean = false;
  userForm: FormGroup | undefined;
  submitted: boolean = false;
  uploading: boolean = false;
  constructor(private formBuilder: FormBuilder, private toasterService: ToastrService, private mainService: MainService) { }

  ngOnInit(): void {
    this.getAllUser();
    this.getAllRoles();
    this.initUserForm();
  }


  get f() {
    return this.userForm.controls;
  }

  initDatatable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      // dom: '<"html5buttons"B>lTfgitp',
      language: {
        search: 'INPUT',
        searchPlaceholder: 'Search records',
      },
      initComplete: function (settings: any, json: any) {
        $('.button').removeClass('dt-button');
        $('.button').addClass('');
      },
      dom: "l <'float-right'B f>  r t i p",
      buttons: [
        {
          text: 'Excel',
          extend: 'excel',
          className: 'table-button btn btn-sm button btn-secondary '
        },
        {
          extend: 'print',
          text: 'Print',
          className: 'table-button btn-sm button btn btn-secondary mr-2 '
        },
        {
          extend: 'pdf',
          text: 'PDF',
          className: 'table-button btn-sm button btn btn-secondary '
        }
      ]
    };
  }

  rerenderDatatable() {
    jQuery('#mainTable').DataTable().destroy();
    this.dtTrigger.next();
  }

  initUserForm() {
    this.userForm = this.formBuilder.group({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      isActive: new FormControl(true)
    })
  }

  getAllRoles() {
    this.allRoles.length = 0;
    this.mainService.getAllUsersRole().subscribe((res: any) => {
      console.log(res);
      this.allRoles = res.data;
      console.log(this.allRoles);
    });
  }


  getAllUser() {
    this.allUsers.length = 0;
    this.mainService.getAllUsers().subscribe((res: any) => {
      console.log(res);
      this.allUsers = res.data;
      console.log(this.allUsers);
      this.dtTrigger.next();
    });
  }

  onSubmit() {
    this.submitted = true;
    this.uploading = true;
    if (this.userForm?.invalid) {
      this.uploading = false;
      this.toasterService.error('Fill Form Properly', 'Invalid Form');
      return;
    } else {
      if (this.editing) {
        this.updateUser(this.userForm.value);
      } else {
        this.addUser(this.userForm.value);
      }
    }
  }

  addUser(user: any) {
    console.log(user)
    this.mainService.addUser(user).subscribe((res: any) => {
      jQuery('#modal3').modal('hide');
      this.uploading = false;
      this.toasterService.success('User Added!', 'Success!');
      this.allUsers.push(res.data);
      console.log(res.data);
      this.resetForm();
      this.rerenderDatatable();
    })
  }

  updateUser(user: any) {
    this.currentUser
    this.mainService.updateUser(user, this.currentUser._id).subscribe((res: any) => {
      jQuery('#modal3').modal('hide');
      this.uploading = false;
      this.toasterService.info('User Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allUsers.splice(this.currentIndex, 1, res.data);
      this.editing = false;
    });
  }

  viewUser(i: number) {
    this.currentUser = this.allUsers[i];
  }

  editUser(i: number) {
    this.editing = true;
    this.currentUser = this.allUsers[i];
    this.currentUserId = this.allUsers[i]._id;
    this.currentIndex = i;
    this.userForm?.get('name')?.setValue(this.currentUser.name);
  }

  deleteUser(i) {
    if (confirm('You Sure you want to delete this User')) {
      this.mainService.deleteUser(this.allUsers[i]._id).subscribe(() => {
        this.toasterService.warning('User Deleted!', 'Deleted!');
        this.allUsers.splice(i, 1);
        this.rerenderDatatable();
      })
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.uploading = false;
    this.userForm.reset();
    this.initUserForm();
  }
}
