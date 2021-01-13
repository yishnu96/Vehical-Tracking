import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from '../modules/map/map.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { UnderconstructionComponent } from './pages/underconstruction/underconstruction.component';


@NgModule({
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [MapComponent, NotfoundComponent, UnderconstructionComponent],
})
export class SharedModule {}
