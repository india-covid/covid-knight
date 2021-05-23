import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccineHomepageComponent } from './components/vaccine-homepage/vaccine-homepage.component';

const routes: Routes = [{
  path: '', component: VaccineHomepageComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaccineRoutingModule { }
