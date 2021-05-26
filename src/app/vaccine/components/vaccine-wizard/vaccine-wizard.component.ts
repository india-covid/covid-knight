import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Center } from '../../models/center.model';
import { ValidationErrors } from '@angular/forms';
import { isNonEmptyArray } from 'src/app/core/utils';
import { AuthService } from 'src/app/core/auth.service';
import { concatMap, map, switchMap, take } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs';


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
  phone: any;
  @Output() done = new EventEmitter<boolean>();

  private _phoneNumber: { number?: string; countryCode?: string } = {}
  subscribing = false;
  constructor(private authService: AuthService,
    private storageService: LocalStorageService) { }

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

  onPhoneChange(phone: { number: string, countryCode: string}, errors?: any) {
    if (errors) {
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
    if (!this.isSubscribeButtonEnabled) {
      return;
    }
   this.subscribing = true;
   this._ping$.pipe(switchMap((p) => this.authService.requestOtp(this._phoneNumber.number)), take(1)).subscribe(results => {
      this.saveCurrentResults(this._phoneNumber.number);
   });
  }


  private saveCurrentResults(phoneNumber: string = '', countryCode: string = 'IN') {
    this.storageService.set('subscription', {time: DayJs().unix(), phoneNumber, countryCode , centers: this.selectedCenters});
    this.done.next(true);
  }

  private get  _ping$() {
   return this.authService
      .ping({ phoneNumber: this._phoneNumber?.number, centers: this.selectedCenters.map(c => c._id) }, 'subscribe')
  }

}
