import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaccineRoutingModule } from './vaccine-routing.module';
import { VaccineHomepageComponent } from './components/vaccine-homepage/vaccine-homepage.component';
import { VaccineWizardComponent } from './components/vaccine-wizard/vaccine-wizard.component';
import { CentersByPinSelectorComponent } from './components/shared/centers-by-pin-selector/centers-by-pin-selector.component';
import { FormsModule } from '@angular/forms'
import { DigitOnlyDirective } from '../core/directives/digit-only.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { CentersByDistrictSelectorComponent } from './components/shared/centers-by-district-selector/centers-by-district-selector.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { VaccineSubscribeComponent } from './components/vaccine-subscribe/vaccine-subscribe.component';
import { HeaderComponent } from './../shared/components/shared/header/header.component';
import { HeaderBackComponent } from './../shared/components/shared/header-back/header-back.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { NgxSpinnerModule } from "ngx-spinner";
import { EmptySpaceComponent } from './components/shared/empty-space/empty-space.component';

@NgModule({
  declarations: [
    VaccineHomepageComponent,
    VaccineWizardComponent,
    CentersByPinSelectorComponent,
    DigitOnlyDirective,
    CentersByDistrictSelectorComponent,
    VaccineSubscribeComponent,
    HeaderComponent,
    HeaderBackComponent,
    // EmptySpaceComponent
  ],
  imports: [
    CommonModule,
    VaccineRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    NgxSpinnerModule
  ]
})
export class VaccineModule { }
