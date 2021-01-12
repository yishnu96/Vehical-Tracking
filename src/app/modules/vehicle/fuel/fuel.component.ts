import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-fuel',
  templateUrl: './fuel.component.html',
  styleUrls: ['./fuel.component.css']
})
export class FuelComponent implements OnInit {

  allVehicleTypes: any[] = [];
  currentIndex: number = 0;
  currentVehicleTypeId: string = '';
  currentVehicleType: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: boolean = false;
  fuelTypeForm: FormGroup;
  submitted: boolean = false;
  uploading: boolean = false;
  constructor(private formBuilder: FormBuilder, private toasterService: ToastrService, private mainService: MainService) {
    this.initDatatable();
  }

  get f() {
    return this.fuelTypeForm.controls;
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
          className: ' btn btn-sm button btn-outline-light ',
          exportOptions: {
            columns: 'th:not(:last-child)'
          }
        },
        {
          extend: 'print',
          text: 'Print',
          className: ' btn-sm button btn  btn-outline-light ',
          exportOptions: {
            columns: 'th:not(:last-child)'
          }
        },
        {
          extend: 'copy',
          text: 'Copy',
          className: ' btn-sm button btn  btn-outline-light ',
          exportOptions: {
            columns: 'th:not(:last-child)'
          }
        },
        {
          extend: 'csv',
          text: 'CSV',
          className: ' btn-sm button btn  btn-outline-light',
          exportOptions: {
            columns: 'th:not(:last-child)'
          }
        },
        {
          extend: 'pdf',
          text: 'PDF',
          className: ' btn-sm button btn  btn-outline-light',
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
    this.fuelTypeForm = this.formBuilder.group({
      fuelTypeName: new FormControl('', [Validators.required]),
      isActive: new FormControl(true)
    })
  }

  onSubmit() {
    this.submitted = true;
    this.uploading = true;
    if (this.fuelTypeForm.invalid) {
      this.uploading = false;
      this.toasterService.error('Fill Form Properly', 'Invalid Form');
    } else {
      if (this.editing) {
        this.updateVehicleType(this.fuelTypeForm?.value);
      } else {
        this.addVehicleType(this.fuelTypeForm?.value);
      }
    }
  }

  addVehicleType(fuel: any) {
    console.log(fuel)
    this.mainService.addFuel(fuel).subscribe((res: any) => {
      console.log(res);
      jQuery('#modal3').modal('hide');
      this.uploading = false;
      this.toasterService.success('Fuel Added!', 'Success!');
      this.allVehicleTypes.push(res.data);
      this.resetForm();
      this.rerenderDatatable();
    })
  }

  updateVehicleType(fuel: any) {
    this.currentVehicleType
    this.mainService.updateFuel(fuel, this.currentVehicleType._id).subscribe((res: any) => {
      jQuery('#modal3').modal('hide');
      this.uploading = false;
      this.toasterService.info('Fuel Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allVehicleTypes.splice(this.currentIndex, 1, res.data);
      this.editing = false;
    });
  }

  getAllVehicleType() {
    this.mainService.getAllFuel().subscribe((res: any) => {
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
    this.fuelTypeForm?.get('fuelTypeName')?.setValue(this.currentVehicleType.fuelTypeName);
  }

  deleteVehicleType(i: number) {
    if (confirm('You Sure you want to delete this Fuel')) {
      this.mainService.deleteFuel(this.allVehicleTypes[i]._id).subscribe(() => {
        this.toasterService.warning('Fuel Deleted!', 'Deleted!');
        this.allVehicleTypes.splice(i, 1);
        this.rerenderDatatable();
      });
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.uploading = false;
    this.fuelTypeForm.reset();
    this.initVehicleTypeForm();
  }
}
