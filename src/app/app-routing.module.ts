import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccinePrivacyPolicyComponent } from './vaccine/components/vaccine-privacy-policy/vaccine-privacy-policy.component'

const routes: Routes = [
  { path: 'privacy-policy', component: VaccinePrivacyPolicyComponent },
  { path: '', loadChildren: () => import('./vaccine/vaccine.module').then(v => v.VaccineModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
