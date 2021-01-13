import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { UnderconstructionComponent } from './pages/underconstruction/underconstruction.component';


@NgModule({
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [ NotfoundComponent, UnderconstructionComponent],
})
export class SharedModule {}
