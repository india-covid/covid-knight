import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaccineRoutingModule } from './vaccine-routing.module';
import { VaccineHomepageComponent } from './components/vaccine-homepage/vaccine-homepage.component';
import { VaccineWizardComponent } from './components/vaccine-wizard/vaccine-wizard.component';
import { CentersByPinSelectorComponent } from './components/shared/centers-by-pin-selector/centers-by-pin-selector.component';
import { CentersByDistrictComponent } from './components/shared/centers-by-district/centers-by-district.component';
import { FormsModule } from '@angular/forms'
import { DigitOnlyDirective } from '../core/directives/digit-only.directive';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    VaccineHomepageComponent,
    VaccineWizardComponent,
    CentersByPinSelectorComponent,
    CentersByDistrictComponent,
    DigitOnlyDirective
  ],
  imports: [
    CommonModule,
    VaccineRoutingModule,
    FormsModule,
    NgSelectModule
  ]
})
export class VaccineModule { }
