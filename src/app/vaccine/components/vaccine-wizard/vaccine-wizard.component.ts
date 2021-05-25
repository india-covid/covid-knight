import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Center } from '../../models/center.model';

enum WizardTabs {
  PIN = 'Pin',
  DISTRICT = 'DISTRICT',
}
@Component({
  selector: 'app-vaccine-wizard',
  templateUrl: './vaccine-wizard.component.html',
  styleUrls: ['./vaccine-wizard.component.scss'],
})
export class VaccineWizardComponent implements OnInit {
  active: boolean = true;
  WizardTabs = WizardTabs;
  activeTab: WizardTabs = WizardTabs.DISTRICT;
  selectedCenters: Center[] = [];

  constructor() {}

  ngOnInit(): void {}

  changeTab(tab: WizardTabs) {
    // perform other here
    this.activeTab = tab;
  }

  centersSelected({ centers }: { centers: Center[] }) {
    this.selectedCenters = centers;
    console.log('selected centers', centers);
  }
}
