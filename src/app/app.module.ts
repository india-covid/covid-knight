import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieModule } from 'ngx-cookie';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpHeaderInterceptor } from './core/http-interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './shared/components/shared/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CookieModule.forRoot(),
    NgbModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
