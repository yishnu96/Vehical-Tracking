import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'src/app/shared/guards';
import { DataTablesModule } from 'angular-datatables';

const routes: Routes = [
  { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class UserModule { }
