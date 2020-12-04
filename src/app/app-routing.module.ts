import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards';
import { HomeComponent } from './modules/layout/home/home.component';
import { NotfoundComponent } from './shared/pages/notfound/notfound.component';
import { UnderconstructionComponent } from './shared/pages/underconstruction/underconstruction.component';
import { MapComponent } from './shared/pages/map/map.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'map', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'oops', component: UnderconstructionComponent },
  { path: '**', component: NotfoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
