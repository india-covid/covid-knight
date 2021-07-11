import { enterAnimationLeft,enterAnimationRight } from './../../../core/animations/pageAnimation';
import { User } from './../../../core/models/user.model';
import { Component, OnInit, EventEmitter,ElementRef, Output } from '@angular/core';
import { Center } from '../../models/center.model';
import { AuthService } from 'src/app/core/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { trigger, style, animate, transition, useAnimation } from '@angular/animations';
import { District } from 'src/app/vaccine/models/district.model';
import { State } from 'src/app/vaccine/models/state.model';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NavigationExtras, Router } from '@angular/router';

enum WizardTabs {
  PIN = 'PINCODE',
  DISTRICT = 'DISTRICT'
}
@Component({
  selector: 'app-vaccine-wizard',
  templateUrl: './vaccine-wizard.component.html',
  styleUrls: ['./vaccine-wizard.component.scss'],
  animations: [
    trigger(
      'enterAnimationLeft', [
      transition(':enter', [
        useAnimation(enterAnimationLeft, {
          params: {
            time: '150ms'
          }
        })
      ])
    ]
    ),
    trigger(
      'enterAnimationRight', [
      transition(':enter', [
        useAnimation(enterAnimationRight, {
          params: {
            time: '150ms'
          }
        })
      ])
    ]
    )
  ],
})
export class VaccineWizardComponent implements OnInit {
  WizardTabs = WizardTabs;
  activeTab: WizardTabs = WizardTabs.PIN;
  selectedCenters: Center[] = [];
  selectedState: State | null | undefined = null;
  selectedDistrict: District | null | undefined = null;
  pincode: string|number = '';
  districtId: string | null = null;
  phone: string='';
  @Output() done = new EventEmitter<boolean>();

  private _phoneNumber: { number?: string; countryCode?: string, } = {}
  subscribing = false;
  user: User | null = null;
  constructor(private authService: AuthService,
    private storageService: LocalStorageService,
    private router: Router,
    private myElement: ElementRef,
    private spinner: NgxSpinnerService) {
      this.spinner.hide();

  }
  ngOnInit(): void {
    //  this.user = this.storageService.get("subscription");
    this.authService.user$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })

  }

  changeTab(tab: WizardTabs) {
    // perform other here
    this.selectedCenters = [];
    this.activeTab = tab;
    this.pincode = '';
    this.districtId = null;
  }

  pinEntered(p: any) {
    this.pincode = p.pincode;

  }
  districtSelected(districtId: any) {
    this.districtId = districtId.districtId;
  }

  centersSelected({ centers }: { centers: Center[] }) {

    this.selectedCenters = centers;
  };

  onPhoneChange(phone: { number: string, countryCode: string }, errors?: any) {
    if (errors) {
      return this._phoneNumber = {};
    }
    return this._phoneNumber = phone
  }

  get phoneNumber() {
    return this._phoneNumber?.number;
  }

  get isSubscribeButtonEnabled() {

      if (this.pincode?.toString().length === 6 || this.districtId) {
        return true;
      }
            return false;
  }


  registerUser(naviagationExtras: NavigationExtras) {
    this.spinner.show();

    if (!this.isSubscribeButtonEnabled) {
      return;
    }
    this.subscribing = true;
    this._ping$.pipe(switchMap((p) => this.authService.requestOtp(this._phoneNumber.number?.toString())), take(1)).subscribe(results => {
      this.saveCurrentResults(this._phoneNumber.number, naviagationExtras);
    });
  }

  goToSlots() {
    let queryType;
    if (this.pincode?.toString().length === 6) {
      queryType = 'pincode';
    } else if (this.districtId) {
      queryType = 'districtId'
    } else {
      return;
    }
    let naviagationExtras: NavigationExtras = {
      queryParams: {
        pincode: this.pincode,
        districtId: this.districtId,
        queryType: queryType
      }
    }
    // if (this.user?.phoneNumber) {
      this.router.navigate(["/slots"], naviagationExtras)
    // } else {
    //   this.registerUser(naviagationExtras);
    // }

  }

  goToSelecteCentersList() {
    this.router.navigate(['/selected-centers']);
  }


  private saveCurrentResults(phoneNumber: string = '', naviagationExtras: NavigationExtras) {
    this.storageService.set('subscription', {time: new Date().getTime() / 1000, phoneNumber,  centers: this.selectedCenters});
    this.spinner.hide();
    this.router.navigate(['/subscription'], naviagationExtras);
  }

  private get _ping$() {
    return this.authService
      .ping({ phoneNumber: this._phoneNumber?.number, centers: this.selectedCenters.map(c => c._id) }, 'subscribe')
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.storageService.set("subscription", {});
      this.user = null;
      this.router.navigate(['/']);

    });
  }

  checkMaxLength(){
    if(this.phone?.toString().length>9){
      return false;
    }
    return true;
}
}
