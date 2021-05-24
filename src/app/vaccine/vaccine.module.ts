import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaccineRoutingModule } from './vaccine-routing.module';
import { VaccineHomepageComponent } from './components/vaccine-homepage/vaccine-homepage.component';
import { VaccineWizardComponent } from './components/vaccine-wizard/vaccine-wizard.component';
import { CentersByPinSelectorComponent } from './components/shared/centers-by-pin-selector/centers-by-pin-selector.component';
import { CentersByDistrictComponent } from './components/shared/centers-by-district/centers-by-district.component';


@NgModule({
  declarations: [
    VaccineHomepageComponent,
    VaccineWizardComponent,
    CentersByPinSelectorComponent,
    CentersByDistrictComponent
  ],
  imports: [
    CommonModule,
    VaccineRoutingModule
  ]
})
export class VaccineModule { }
