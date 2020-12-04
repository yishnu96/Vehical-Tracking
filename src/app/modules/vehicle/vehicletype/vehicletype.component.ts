import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-vehicletype',
  templateUrl: './vehicletype.component.html',
  styleUrls: ['./vehicletype.component.css']
})
export class VehicletypeComponent implements OnInit {
  allVehicleTypes: any[] = [];
  currentIndex: number = 0;
  currentVehicleTypeId: string = '';
  currentVehicleType: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: boolean = false;
  vehicleTypeForm: FormGroup;
  submitted: boolean = false;
  uploading: boolean = false;
  constructor(private formBuilder: FormBuilder, private toasterService: ToastrService, private mainService: MainService) {
    this.initDatatable();
  }

  get f() {
    return this.vehicleTypeForm.controls;
  }

  ngOnInit() {
    this.initVehicleTypeForm();
    this.getAllVehicleType();
  }


  initDatatable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [5, 10, 15, 25, -1],
        [5, 10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      },
      initComplete: function (settings, json) {
        $('#datatable_paginate').addClass('pagination-sm');
        $('#datatable_paginate').remove('pagination');
        $('.button').removeClass('dt-button btn-secondary');
        $('.dt-buttons').addClass('float-right');
      },
      dom: "<'row' <'col-md-6 col-sm-12'l> <'col-md-3'B> <'col-md-3 col-sm-12' f> >r t  <'row' <'col-md-10 col-sm-12'i> <'col-md-2 col-sm-12' p> >",
      buttons: [
        {
          text: 'Excel',
          extend: 'excel',
          className: ' btn btn-sm button btn-outline-primary ',
          exportOptions: {
            columns: 'th:not(:last-child)'
          }
        },
        {
          extend: 'print',
          text: 'Print',
          className: ' btn-sm button btn  btn-outline-primary ',
          exportOptions: {
            columns: 'th:not(:last-child)'
          }
        },
        {
          extend: 'copy',
          text: 'Copy',
          className: ' btn-sm button btn  btn-outline-primary ',
          exportOptions: {
            columns: 'th:not(:last-child)'
          }
        },
        {
          extend: 'csv',
          text: 'CSV',
          className: ' btn-sm button btn  btn-outline-primary',
          exportOptions: {
            columns: 'th:not(:last-child)'
          }
        },
        {
          extend: 'pdf',
          text: 'PDF',
          className: ' btn-sm button btn  btn-outline-primary',
          exportOptions: {
            columns: 'th:not(:last-child)'
          }
        }
      ]
    };
  }

  rerenderDatatable() {
    jQuery('#mainTable').DataTable().destroy();
    this.dtTrigger.next();
  }

  initVehicleTypeForm() {
    this.vehicleTypeForm = this.formBuilder.group({
      vehicleTypeName: new FormControl('', [Validators.required]), 
      isActive: new FormControl(true)
    })
  }

  onSubmit() {
    this.submitted = true;
    this.uploading = true;
    if (this.vehicleTypeForm.invalid) {
      this.uploading = false;
      this.toasterService.error('Fill Form Properly', 'Invalid Form');
    } else {
      if (this.editing) {
        this.updateVehicleType(this.vehicleTypeForm?.value);
      } else {
        this.addVehicleType(this.vehicleTypeForm?.value);
      }
    }
  }

  addVehicleType(vehicleType: any) {
    console.log(vehicleType)
    this.mainService.addVehicleType(vehicleType).subscribe((res: any) => {
      console.log(res);
      jQuery('#modal3').modal('hide');
      this.uploading = false;
      this.toasterService.success('VehicleType Added!', 'Success!');
      this.allVehicleTypes.push(res.data);
      this.resetForm();
      this.rerenderDatatable();
    })
  }

  updateVehicleType(vehicleType: any) {
    this.currentVehicleType
    this.mainService.updateVehicleType(vehicleType, this.currentVehicleType._id).subscribe((res: any) => {
      jQuery('#modal3').modal('hide');
      this.uploading = false;
      this.toasterService.info('VehicleType Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allVehicleTypes.splice(this.currentIndex, 1, res.data);
      this.editing = false;
    });
  }

  getAllVehicleType() {
    this.mainService.getAllVehicleType().subscribe((res: any) => {
      console.log(res);
      this.allVehicleTypes = res.data;
      this.dtTrigger.next();
    });
  }

  viewVehicleType(i: number) {
    this.currentVehicleType = this.allVehicleTypes[i];
  }

  editVehicleType(i: number) {
    this.editing = true;
    this.currentVehicleType = this.allVehicleTypes[i];
    this.currentVehicleTypeId = this.allVehicleTypes[i]._id;
    this.currentIndex = i;
    this.vehicleTypeForm?.get('vehicleTypeName')?.setValue(this.currentVehicleType.vehicleTypeName);
  }

  deleteVehicleType(i: number) {
    if (confirm('You Sure you want to delete this VehicleType')) {
      this.mainService.deleteVehicleType(this.allVehicleTypes[i]._id).subscribe(() => {
        this.toasterService.warning('VehicleType Deleted!', 'Deleted!');
        this.allVehicleTypes.splice(i, 1);
        this.rerenderDatatable();
      });
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.uploading = false;
    this.vehicleTypeForm.reset();
    this.initVehicleTypeForm();
  }

}
