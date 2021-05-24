import { Component, OnInit } from '@angular/core';

enum WizardTabs {
  PIN = 'Pin',
  DISTRICT = 'DISTRICT'
}
@Component({
  selector: 'app-vaccine-wizard',
  templateUrl: './vaccine-wizard.component.html',
  styleUrls: ['./vaccine-wizard.component.scss']
})
export class VaccineWizardComponent implements OnInit {

  WizardTabs = WizardTabs;
  activeTab: WizardTabs = WizardTabs.PIN;


  constructor() { }

  ngOnInit(): void {
  }

  changeTab(tab: WizardTabs) {
    // perform other here
    this.activeTab = tab;
  }

}
