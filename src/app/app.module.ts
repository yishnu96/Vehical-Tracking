import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { AuthHeaderInterceptor } from './interceptors/header.interceptor';
import { CatchErrorInterceptor } from './interceptors/http-error.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './modules/layout/home/home.component';
import { HeaderComponent } from './modules/layout/header/header.component';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { UserModule } from './modules/user/user.module';
import { ToastrModule } from 'ngx-toastr';
import { AuthModule } from './modules/auth/auth.module';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AuthModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAPS_API
    }),
    AgmDirectionModule,
    SharedModule,
    VehicleModule,
    UserModule,
    AppRoutingModule
  ],
  declarations: [AppComponent, HeaderComponent, HomeComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CatchErrorInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
