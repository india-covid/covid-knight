import { LastSyncComponent } from './components/shared/last-sync/last-sync.component';
import { VaccineContactComponent } from './components/vaccine-contact/vaccine-contact.component';
import { VaccineDonateComponent } from './components/vaccine-donate/vaccine-donate.component';
import { FilterCenterPipe } from './pipes/filter-center.pipe';
import { SubscribedCentersComponent } from './components/shared/subscribed-centers/subscribed-centers.component';
import { SubscribedCenter } from './models/subscribedCenter';
import { VaccineAuthHomeComponent } from './components/vaccine-auth-home/vaccine-auth-home.component';
import { VaccineSlotsComponent } from './components/vaccine-slots/vaccine-slots.component';
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
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PopoverModule } from 'ngx-bootstrap/popover';
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
    VaccineSlotsComponent,
    VaccineAuthHomeComponent,
    SubscribedCentersComponent,
    FilterCenterPipe,
    VaccineDonateComponent,
    VaccineContactComponent,
    LastSyncComponent,

  ],
  imports: [
    CommonModule,
    VaccineRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    NgxSpinnerModule,
    BsDropdownModule,
    AccordionModule.forRoot(),
    PopoverModule.forRoot()

  ],
  providers:[
  FilterCenterPipe

  ]
})
export class VaccineModule { }
