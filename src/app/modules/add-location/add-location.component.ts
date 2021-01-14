import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {

  long: any;
  lat: any;
  venue: any;
  locationForm: FormGroup;
  allVehicles: any[] = [];
  id: any;

  constructor(private formBuilder: FormBuilder, private toasterService: ToastrService, private mainService: MainService) {
    this.getCurrentLocation();
  }

  ngOnInit() {
    // await this.getCurrentLocation();
    this.initLocationForm();
    this.getAllVehicle();
  }

  initLocationForm() {
    this.locationForm = this.formBuilder.group({
      vehicle: new FormControl('', [Validators.required]),
      coordinates: new FormGroup({
        latitude: new FormControl(this.lat),
        longitude: new FormControl(this.long)
      })

    });
  }

  getAllVehicle() {
    this.mainService.getAllVehicle().subscribe((res: any) => {
      console.log(res);
      this.allVehicles = res.data;
    });
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(res => {
      console.log(res)
      this.lat = res.coords.latitude;
      this.long = res.coords.longitude;
    });
  }

  placeMarker($event) {
    console.log($event);

    this.lat = $event.coords.lat;
    this.long = $event.coords.lng;
    console.log(this.lat, this.long);
    this.locationForm.get('latitude').setValue(this.lat);
    this.locationForm.get('longitude').setValue(this.long);
    this.findAddress(this.lat, this.long);
  }

  findCoordinates(e) {
    console.log(e.target.value);
    this.venue = e.target.value;
    let address = this.venue;
    if (address) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results, status) => {
        if (status == 'OK') {
          this.venue = results[0].formatted_address;
          this.lat = results[0].geometry.location.lat();
          this.long = results[0].geometry.location.lng();
          this.locationForm.get('latitude').setValue(this.lat);
          this.locationForm.get('longitude').setValue(this.long);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      })
    }
  }

  findAddress(lat, lng) {
    var geocoder = new google.maps.Geocoder();
    // var lat, lng;
    geocoder.geocode({ 'location': { lat, lng } }, (results, status) => {
      if (status == 'OK') {
        console.log(results[0].formatted_address);
        // this.locationForm.get('eventVenue').setValue(results[0].formatted_address);
        this.venue = results[0].formatted_address;
        this.lat = results[0].geometry.location.lat();
        this.long = results[0].geometry.location.lng();
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    })
  }

  submit() {
    this.id = this.locationForm.get('vehicle');
    this.locationForm.get('coordinates').get('latitude').setValue(this.lat);
    this.locationForm.get('coordinates').get('longitude').setValue(this.long);
    console.log(this.locationForm.value);
    // this.mainService.generateLocations(this.id, this.locationForm.value).subscribe((res: any) => {
    //   console.log(res);

    // })

  }

}
