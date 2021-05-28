import { VaccineSelectedCentersComponent } from './components/vaccine-selected-centers/vaccine-selected-centers.component';
import { VaccineSlotsComponent } from './components/vaccine-slots/vaccine-slots.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccineHomepageComponent } from './components/vaccine-homepage/vaccine-homepage.component';
import { VaccineSubscribeComponent } from './components/vaccine-subscribe/vaccine-subscribe.component';
const routes: Routes = [{
  path: '', component: VaccineHomepageComponent,
}, {
  path: 'subscription', component: VaccineSubscribeComponent
},

{
  path:'slots',component:VaccineSlotsComponent
},
{
  path:'selected-centers',component:VaccineSelectedCentersComponent

}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaccineRoutingModule { }
