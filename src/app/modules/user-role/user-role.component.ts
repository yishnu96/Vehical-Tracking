import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MainService } from 'src/app/shared/services/main.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {
  allRoles: any[] = [];
  currentIndex: number = 0;
  currentRoleId: string = '';
  currentRole: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: boolean = false;
  roleForm: FormGroup;
  submitted: boolean = false;
  uploading: boolean = false;
  constructor(private formBuilder: FormBuilder, private toasterService: ToastrService, private mainService: MainService) { }

  get f() {
    return this.roleForm.controls;
  }

  ngOnInit() {
    this.initRoleForm();
    this.initDatatable();
    this.getAllRole();
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

  initRoleForm() {
    this.roleForm = this.formBuilder.group({
      roleName: new FormControl('', [Validators.required]),
      isActive: new FormControl(true)
    })
  }

  onSubmit() {
    this.submitted = true;
    this.uploading = true;
    if (this.roleForm?.invalid) {
      this.uploading = false;
      this.toasterService.error('Fill Form Properly', 'Invalid Form');
      return;
    } else {
      if (this.editing) {
        this.updateRole(this.roleForm?.value);
      } else {
        this.addRole(this.roleForm?.value);
      }
    }
  }

  addRole(role) {
    this.mainService.addUserRole(role).subscribe((res: any) => {
      this.uploading = false;
      this.toasterService.success('Role Added!', 'Success!');
      this.allRoles.push(res.data);
      console.log(res.data);
      this.resetForm();
      this.rerenderDatatable();
      jQuery('#modal3').modal('hide');
    })
  }

  updateRole(role: any) {
    this.currentRole
    this.mainService.updateUserRole(role, this.currentRole._id).subscribe((res: any) => {
      jQuery('#modal3').modal('hide');
      this.uploading = false;
      this.toasterService.info('Role Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allRoles.splice(this.currentIndex, 1, res.data);
      this.editing = false;
    });
  }

  getAllRole() {
    this.allRoles.length = 0;
    this.mainService.getAllUsersRole().subscribe((res: any) => {
      this.allRoles = res.data;
      console.log(this.allRoles);
    });
  }

  viewRole(i: number) {
    this.currentRole = this.allRoles[i];
  }

  editRole(i: number) {
    this.editing = true;
    this.currentRole = this.allRoles[i];
    this.currentRoleId = this.allRoles[i]._id;
    this.currentIndex = i;
    this.roleForm.get('roleName').setValue(this.currentRole.roleName);
    this.roleForm.get('isActive').setValue(this.currentRole.isActive);
  }

  deleteRole(i) {
    if (confirm('You Sure you want to delete this Role')) {
      this.mainService.deleteUserRole(this.allRoles[i]._id).subscribe(() => {
        this.toasterService.warning('Role Deleted!', 'Deleted!');
        this.allRoles.splice(i, 1);
        this.rerenderDatatable();
      })
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.uploading = false;
    this.roleForm.reset();
    this.initRoleForm();
  }

}
