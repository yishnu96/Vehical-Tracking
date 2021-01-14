import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { TokenStorage } from './auth/token.storage';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  userUrl = "http://localhost:5000/api/user";
  fuelUrl = "http://localhost:5000/api/fuel";
  vehicleTypeUrl = "http://localhost:5000/api/vehicletype";
  vehicleUrl = "http://localhost:5000/api/vehicle";
  localtionUrl = "http://localhost:5000/api/location";

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': this.authService.getAuthorizationHeaders()
  });
  constructor(private http: HttpClient, private tokenService: TokenStorage, private authService: AuthService) { }

  addUser(obj: any) {
    return this.http.post(this.userUrl, obj, { headers: this.headers });
  }

  getAllUsers() {
    return this.http.get(this.userUrl, { headers: this.headers });
  }

  getAllDrivers() {
    return this.http.get(this.userUrl + '/drivers', { headers: this.headers });
  }

  updateUser(obj: any, id: string) {
    return this.http.put(this.userUrl + '/' + id, obj, { headers: this.headers });
  }

  deleteUser(id: string) {
    return this.http.delete(this.userUrl + '/' + id, { headers: this.headers });
  }


  //Vehicle
  addVehicle(obj: any) {
    return this.http.post(this.vehicleUrl, obj, { headers: this.headers });
  }

  getAllVehicle() {
    return this.http.get(this.vehicleUrl, { headers: this.headers });
  }

  updateVehicle(obj: any, id: string) {
    return this.http.put(this.vehicleUrl + '/' + id, obj, { headers: this.headers });
  }

  deleteVehicle(id: string) {
    return this.http.delete(this.vehicleUrl + '/' + id, { headers: this.headers });
  }

  //Vehicle Type
  addVehicleType(obj: any) {
    return this.http.post(this.vehicleTypeUrl, obj, { headers: this.headers });
  }

  getAllVehicleType() {
    return this.http.get(this.vehicleTypeUrl, { headers: this.headers });
  }

  updateVehicleType(obj: any, id: string) {
    return this.http.put(this.vehicleTypeUrl + '/' + id, obj, { headers: this.headers });
  }

  deleteVehicleType(id: string) {
    return this.http.delete(this.vehicleTypeUrl + '/' + id, { headers: this.headers });
  }


  //Vehicle Fuel
  addFuel(obj: any) {
    return this.http.post(this.fuelUrl, obj, { headers: this.headers });
  }

  getAllFuel() {
    return this.http.get(this.fuelUrl, { headers: this.headers });
  }

  updateFuel(obj: any, id: string) {
    return this.http.put(this.fuelUrl + '/' + id, obj, { headers: this.headers });
  }

  deleteFuel(id: string) {
    return this.http.delete(this.fuelUrl + '/' + id, { headers: this.headers });
  }

  //Locations
  getLocations(id) {
    return this.http.get(this.localtionUrl + '/vehicle/' + id, { headers: this.headers });
  }

  generateLocations(id) {
    return this.http.post(this.localtionUrl + '/' + id, {}, { headers: this.headers });
  }
}
