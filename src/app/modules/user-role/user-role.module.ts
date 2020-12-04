import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleComponent } from './user-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'src/app/shared/guards';
import { DataTablesModule } from 'angular-datatables';


const routes: Routes = [
  { path: 'role', component: UserRoleComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [UserRoleComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class UserRoleModule { }
