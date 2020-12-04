import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  allVechicles: any[] = [];
  allVechiclesOriginal: any[] = [];
  currentLocation: { lat: number, lng: number };
  mapsOption: any = {
    zoom: 9
  }
  markerArray: any[] = [];

  route: { origin, destination };

  constructor(private mainService: MainService, private toasterService: ToastrService) {
    this.getAllVehicles();
  }

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    console.log('pos')
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos)
      this.currentLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    }, (err) => {
      console.log(err)
    }, { timeout: 10000 })
  }

  getAllVehicles() {
    this.mainService.getAllVehicle().subscribe((res: any) => {
      console.log(res);
      this.allVechicles = res.data;
      this.allVechiclesOriginal = res.data;
    })
  }

  getLocationOfVehicle(id) {
    this.markerArray.length = 0;
    this.mainService.getLocations(id).subscribe((res: any) => {
      console.log(res);
      if (res.data) {
        let locationArray = res.data.coordinates;
        if (locationArray.length) {
          this.markerArray = res.data.coordinates;
          this.currentLocation = {
            lat: locationArray[locationArray.length - 1].latitude,
            lng: locationArray[locationArray.length - 1].longitude
          }
          let origin = { lat: Number(locationArray[0].latitude), lng: Number(locationArray[0].longitude) };
          let destination = { lat: Number(locationArray[locationArray.length - 1].latitude), lng: Number(locationArray[locationArray.length - 1].longitude) };
          this.route = { origin: origin, destination: destination };
          console.log(this.route.origin)
          this.mapsOption.zoom = 12;
        } else {
          this.toasterService.info('No location Found for Selected Vechicle', 'No Location Found')
        }
      } else {
        this.toasterService.info('No location Found for Selected Vechicle', 'No Location Found')
      }
    })
  }

  search(event) {
    let text = event.target.value;
    let vehicleArray = [...this.allVechiclesOriginal];
    if (text.length) {
      this.allVechicles = vehicleArray.filter(vehicle => (vehicle.vehicleNumber).includes(text));
    } else {
      this.allVechicles = [];
      this.allVechicles = [...this.allVechiclesOriginal];
    }
  }

}
