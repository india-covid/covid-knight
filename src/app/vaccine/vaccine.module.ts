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
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input'

@NgModule({
  declarations: [
    VaccineHomepageComponent,
    VaccineWizardComponent,
    CentersByPinSelectorComponent,
    DigitOnlyDirective,
    CentersByDistrictSelectorComponent
  ],
  imports: [
    CommonModule,
    VaccineRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxIntlTelInputModule
  ]
})
export class VaccineModule { }
