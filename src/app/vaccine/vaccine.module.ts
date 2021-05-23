import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VaccineRoutingModule } from './vaccine-routing.module';
import { VaccineHomepageComponent } from './components/vaccine-homepage/vaccine-homepage.component';
import { VaccineWizardComponent } from './components/vaccine-wizard/vaccine-wizard.component';
import { CenterByDistrictSelectorComponent } from './components/vaccine-wizard/center-by-district-selector/center-by-district-selector.component';
import { CenterByPinSelectorComponent } from './components/vaccine-wizard/center-by-pin-selector/center-by-pin-selector.component';


@NgModule({
  declarations: [
    VaccineHomepageComponent,
    VaccineWizardComponent,
    CenterByDistrictSelectorComponent,
    CenterByPinSelectorComponent
  ],
  imports: [
    CommonModule,
    VaccineRoutingModule
  ]
})
export class VaccineModule { }
