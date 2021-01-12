import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MainService } from 'src/app/shared/services/main.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  allVehicles: any[] = [];
  allVehicleTypes: any[] = [];
  allDrivers: any[] = [];
  allFuels: any[] = [];
  currentIndex: number = 0;
  currentVehicleId: string = '';
  currentVehicle: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: boolean = false;
  VehicleForm: FormGroup;
  submitted: boolean = false;
  uploading: boolean = false;
  constructor(private formBuilder: FormBuilder, private toasterService: ToastrService, private mainService: MainService) {
    this.initDatatable();
  }

  get f() {
    return this.VehicleForm.controls;
  }

  ngOnInit() {
    this.initVehicleForm();
    this.getAllVehicle();
    this.getAllDrivers();
    this.getAllVehicleTypes();
    this.getAllFuelTypes();
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

  initVehicleForm() {
    this.VehicleForm = this.formBuilder.group({
      fuelType: new FormControl('', [Validators.required]),
      driver: new FormControl('', [Validators.required]),
      vehicleNumber: new FormControl('', [Validators.required]),
      vehicleType: new FormControl('', [Validators.required])
    })
  }

  getAllVehicle() {
    this.mainService.getAllVehicle().subscribe((res: any) => {
      console.log(res);
      this.allVehicles = res.data;
      this.dtTrigger.next();
    });
  }

  getAllVehicleTypes() {
    this.mainService.getAllVehicleType().subscribe((res: any) => {
      console.log(res);
      this.allVehicleTypes = res.data;
    });
  }

  getAllFuelTypes() {
    this.mainService.getAllFuel().subscribe((res: any) => {
      console.log(res);
      this.allFuels = res.data;
    });
  }

  getAllDrivers() {
    this.mainService.getAllDrivers().subscribe((res: any) => {
      console.log(res);
      this.allDrivers = res.data;
    });
  }

  onSubmit() {
    this.submitted = true;
    this.uploading = true;
    if (this.VehicleForm.invalid) {
      this.uploading = false;
      this.toasterService.error('Fill Form Properly', 'Invalid Form');
      console.log(this.VehicleForm)
    } else {
      if (this.editing) {
        this.updateVehicle(this.VehicleForm?.value);
      } else {
        this.addVehicle(this.VehicleForm?.value);
      }
    }
  }

  addVehicle(fuel: any) {
    console.log(fuel)
    this.mainService.addVehicle(fuel).subscribe((res: any) => {
      console.log(res);
      jQuery('#modal3').modal('hide');
      this.uploading = false;
      this.toasterService.success('Fuel Added!', 'Success!');
      this.allVehicles.push(res.data);
      this.resetForm();
      this.rerenderDatatable();
    })
  }

  updateVehicle(fuel: any) {
    this.currentVehicle
    this.mainService.updateVehicle(fuel, this.currentVehicle._id).subscribe((res: any) => {
      jQuery('#modal3').modal('hide');
      this.uploading = false;
      this.toasterService.info('Fuel Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allVehicles.splice(this.currentIndex, 1, res.data);
      this.editing = false;
    });
  }


  viewVehicle(i: number) {
    this.currentVehicle = this.allVehicles[i];
  }

  editVehicle(i: number) {
    this.editing = true;
    this.currentVehicle = this.allVehicles[i];
    this.currentVehicleId = this.allVehicles[i]._id;
    this.currentIndex = i;
    this.VehicleForm?.get('vehicleNumber')?.setValue(this.currentVehicle.vehicleNumber);
  }

  generateLocations(index) {
    let id = this.allVehicles[index]._id;
    this.mainService.generateLocations(id).subscribe(res => {
      this.toasterService.warning('Location Added!', 'Generated!');
    })
  }

  deleteVehicle(i: number) {
    if (confirm('You Sure you want to delete this Fuel')) {
      this.mainService.deleteVehicle(this.allVehicles[i]._id).subscribe(() => {
        this.toasterService.warning('Fuel Deleted!', 'Deleted!');
        this.allVehicles.splice(i, 1);
        this.rerenderDatatable();
      });
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.uploading = false;
    this.VehicleForm.reset();
    this.initVehicleForm();
  }


}
