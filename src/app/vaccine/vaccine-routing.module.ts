import { VaccineTermsConditionComponent } from './components/vaccine-terms-condition/vaccine-terms-condition.component';
import { VaccineContactComponent } from './components/vaccine-contact/vaccine-contact.component';
import { VaccineDonateComponent } from './components/vaccine-donate/vaccine-donate.component';
import { VaccineWizardComponent } from './components/vaccine-wizard/vaccine-wizard.component';
import { SubscribedCentersComponent } from './components/shared/subscribed-centers/subscribed-centers.component';
import { VaccineAuthHomeComponent } from './components/vaccine-auth-home/vaccine-auth-home.component';
import { AuthGuard } from './../core/auth.guard';
import { VaccineSlotsComponent } from './components/vaccine-slots/vaccine-slots.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccineHomepageComponent } from './components/vaccine-homepage/vaccine-homepage.component';
import { VaccineSubscribeComponent } from './components/vaccine-subscribe/vaccine-subscribe.component';
import { VaccineFaqComponent } from './components/vaccine-faq/vaccine-faq.component';
import { VaccinePrivacyPolicyComponent } from './components/vaccine-privacy-policy/vaccine-privacy-policy.component'
import { VaccineCreditsComponent } from './components/vaccine-credits/vaccine-credits.component';

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
    // canActivate: [AuthGuard]
  },
  {
    path: 'subscribed',
    component: SubscribedCentersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-subscription',
    component: VaccineWizardComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'home',
    component: VaccineAuthHomeComponent,
    canActivate: [AuthGuard]

  },
  /* Disabled as we use credits instead of donate
  {
    path: 'donate',
    component: VaccineDonateComponent,
  },
  */
  {
    path: 'contact',
    component: VaccineContactComponent,
  },
  {
    path: 'faq',
    component: VaccineFaqComponent,

  },
  {
    path: 'privacy-policy',
    component: VaccinePrivacyPolicyComponent
  },
  {
    path: 'terms-condition',
    component: VaccineTermsConditionComponent
  },
  {
    path: 'credits',
    component: VaccineCreditsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaccineRoutingModule {}
