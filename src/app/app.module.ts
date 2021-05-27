import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieModule } from 'ngx-cookie';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpHeaderInterceptor } from './core/http-interceptor';
// import { HeaderComponent } from './shared/components/shared/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    // HeaderComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
