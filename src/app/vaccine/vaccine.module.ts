import { VaccineHowToComponent } from './components/vaccine-how-to/vaccine-how-to.component';
import { SharedModule } from './../shared/components/shared.module';
import { VaccineContactComponent } from './components/vaccine-contact/vaccine-contact.component';
import { VaccineDonateComponent } from './components/vaccine-donate/vaccine-donate.component';
import { FilterCenterPipe } from './pipes/filter-center.pipe';
import { SubscribedCentersComponent } from './components/shared/subscribed-centers/subscribed-centers.component';
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
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { VaccineFaqComponent } from './components/vaccine-faq/vaccine-faq.component';
import { VaccinePrivacyPolicyComponent } from './components/vaccine-privacy-policy/vaccine-privacy-policy.component';
import { VaccineCreditsComponent } from './components/vaccine-credits/vaccine-credits.component';

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
    VaccineHowToComponent,
    VaccineFaqComponent,
    VaccinePrivacyPolicyComponent,
    VaccineCreditsComponent
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
    PopoverModule.forRoot(),
    NgxSkeletonLoaderModule,
    SharedModule
  ],
  providers:[
  FilterCenterPipe

  ]
})
export class VaccineModule { }
