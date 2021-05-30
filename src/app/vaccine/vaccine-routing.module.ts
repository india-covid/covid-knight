import { AuthGuard } from './../core/auth.guard';
import { VaccineSelectedCentersComponent } from './components/vaccine-selected-centers/vaccine-selected-centers.component';
import { VaccineSlotsComponent } from './components/vaccine-slots/vaccine-slots.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccineHomepageComponent } from './components/vaccine-homepage/vaccine-homepage.component';
import { VaccineSubscribeComponent } from './components/vaccine-subscribe/vaccine-subscribe.component';

const routes: Routes = [
  {
    path: '',
    component: VaccineHomepageComponent,
  },
  {
    path: 'subscription',
    component: VaccineSubscribeComponent,
   // canActivate: [AuthGuard]


  },

  {
    path: 'slots',
    component: VaccineSlotsComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'selected-centers',
    component: VaccineSelectedCentersComponent,
    canActivate: [AuthGuard]

  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaccineRoutingModule {}
