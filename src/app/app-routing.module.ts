import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards';
import { HomeComponent } from './modules/home/home.component';
import { NotfoundComponent } from './shared/pages/notfound/notfound.component';
import { UnderconstructionComponent } from './shared/pages/underconstruction/underconstruction.component';
import { AddLocationComponent } from './modules/add-location/add-location.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'add-location', component: AddLocationComponent, canActivate: [AuthGuard]},
  { path: 'oops', component: UnderconstructionComponent },
  { path: '**', component: NotfoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
