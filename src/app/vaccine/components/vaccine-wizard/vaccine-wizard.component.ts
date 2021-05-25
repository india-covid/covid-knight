import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Center } from '../../models/center.model';
import { CountryISO } from 'ngx-intl-tel-input'
import { ValidationErrors } from '@angular/forms';
import { isNonEmptyArray } from 'src/app/core/utils';
enum WizardTabs {
  PIN = 'Pin',
  DISTRICT = 'DISTRICT'
}
@Component({
  selector: 'app-vaccine-wizard',
  templateUrl: './vaccine-wizard.component.html',
  styleUrls: ['./vaccine-wizard.component.scss'],
})
export class VaccineWizardComponent implements OnInit {
  WizardTabs = WizardTabs;
  activeTab: WizardTabs = WizardTabs.DISTRICT;
  selectedCenters: Center[] = [];
  CountryISO = CountryISO;
  private _phoneNumber: {number?: string; countryCode?: string} = {}

  phone: any;
  constructor() { }

  ngOnInit(): void {
  }

  changeTab(tab: WizardTabs) {
    // perform other here
    this.selectedCenters = [];
    this.activeTab = tab;
  }

  centersSelected({ centers }: { centers: Center[] }) {
    this.selectedCenters = centers;
  };

  onPhoneChange(phone: {number: string, countryCode: string}, errors?: any) {
      if(errors) {
        return this._phoneNumber = {};
      }
      return this._phoneNumber = phone
  }



  get phoneNumber() {
      return this._phoneNumber?.number;
  }


  get isSubscribeButtonEnabled() {
    return this._phoneNumber?.number && isNonEmptyArray(this.selectedCenters);
  }

  subscribeClicked() {
    if(!this.isSubscribeButtonEnabled) {
      return;
    }
    console.log('centers', this.selectedCenters);
    console.log('phoneNumber', this._phoneNumber);
  }

}
