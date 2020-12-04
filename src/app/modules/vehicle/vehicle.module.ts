import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleComponent } from './vehicle/vehicle.component';
import { FuelComponent } from './fuel/fuel.component';
import { VehicletypeComponent } from './vehicletype/vehicletype.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'src/app/shared/guards';


const routes: Routes = [
  { path: 'vehicle', component: VehicleComponent, canActivate: [AuthGuard] },
  { path: 'vehicletype', component: VehicletypeComponent, canActivate: [AuthGuard] },
  { path: 'fuel', component: FuelComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [VehicleComponent, FuelComponent, VehicletypeComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class VehicleModule { }
