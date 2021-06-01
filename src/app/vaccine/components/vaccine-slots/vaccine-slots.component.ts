import { FilterCenterPipe } from './../../pipes/filter-center.pipe';
import { environment } from 'src/environments/environment';
import { forkJoin, timer, of, Observable, Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubscribedCenter } from './../../models/subscribedCenter';
import { AuthService } from 'src/app/core/auth.service';
import { User } from './../../../core/models/user.model';
import { CenterWithSessions, DOSE, AGE,VACCINES } from './../../models/center.model';
import { VaccineSession } from './../../models/vaccine-session.model';
import { Subscriptions } from './../../models/subscriptions';
import { SubscriptionService } from './../../services/subscription.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Center } from 'src/app/vaccine/models/center.model';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs';
import {
  trigger,
  transition,
  animate,
  style,
  state,
  sequence,
} from '@angular/animations';
import { shareReplay } from 'rxjs/operators';

export enum QueryType {
  PIN = 'pincode',
  DISTRICT = 'districtId',
}



@Component({
  selector: 'app-vaccine-slots',
  templateUrl: './vaccine-slots.component.html',
  styleUrls: ['./vaccine-slots.component.scss'],
})
export class VaccineSlotsComponent implements OnInit {
  QueryType = QueryType;
  DOSE=DOSE;
  AGE=AGE;
  VACCINES=VACCINES;
  queryData: any | null = null;

   readonly MAXSUBSCRIPTION:number=environment.maxSubscription;
   accountTotalSubscribe :number=0

  @ViewChild('header') header!: ElementRef<HTMLElement>;
@ViewChild('limitReachedTemplate') limitReachedTemplate!:TemplateRef<any>;
  private subscribedCenters: SubscribedCenter[] = [];

  private newSubscribeCenters: Center[] = [];
  newTotalSubscribe: number = 0;

  centers: Center[] = [];
  centersSessions: VaccineSession[] = [];
  centersWithSession: any[] = [];

  isCenterEmpty: boolean = false;

  dateRange: string[] = [];

  activeDay: number = 0;
  activeDate: string = '';
  private totalDatesToShow: number = 7;
  //filters
  dose: string = DOSE.ALL;

  vaccineType: string =this.VACCINES.ALL;

  age: string = AGE.ALL;
  hospitalName: string = '';


  modalRef!: BsModalRef;
  modalConfig = {
    backdrop: true,
    ignoreBackdropClick: false
  };
  constructor(
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private vaccineRestService: VaccineRestService,
    private storageService: LocalStorageService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) {
    this.spinner.show();
    this.getSubscribedCenters();
  }

  getSubscribedCenters() {
    this.subscriptionService.getSubscriptionCenters().subscribe((data) => {
      this.subscribedCenters = data;
      this.accountTotalSubscribe = data.length;
      console.log(data);
      this.getRouteParams();
    });
  }

  getRouteParams() {
    this.route.queryParams.subscribe((params) => {
      this.queryData = params;
      if (params.queryType == this.QueryType.PIN) {
        //if query type is pincode
        const centers$ = this.vaccineRestService
          .centersByPinCode(params.pincode)
          .pipe(shareReplay()); //this.getCentersWithPincdoe(params[this.QueryType.PIN]);
        const centersSessions$ = this.vaccineRestService.getSessionsByPincode(
          params.pincode,
          DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
        ); //this.getSessionsByPincode(params[this.QueryType.PIN], this.activeDay);

        forkJoin(centers$, centersSessions$).subscribe((response) => {
          // all observables have been completed
          this.centers = response[0];
          this.centersSessions = response[1];
          console.log('got both ', this.centers, this.centersSessions);
          this.mergeCenterAndSessions();
        });
      } else if (params.queryType == this.QueryType.DISTRICT) {
        //if query type is district
        const centers$ = this.vaccineRestService.centersByDistrictId(
          params.districtId
        );
        const centersSessions$ =
          this.vaccineRestService.getSessionsByDistrictId(
            params.districtId,
            DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
          );
        forkJoin(centers$, centersSessions$).subscribe((response) => {
          // all observables have been completed
          this.centers = response[0];
          this.centersSessions = response[1];
          console.log('got both ', this.centers, this.centersSessions);
          this.mergeCenterAndSessions();
        });
      }
    });
  }

  ngOnInit() {
    // console.log(this.subscription.centers);
    this.generateDays(this.totalDatesToShow);
  }
  generateDays(days: number) {
    //generate dates from today to n days
    this.activeDate = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');
    console.log('active date is ', this.activeDate);

    const dateMove = new Date();
    while (days > 0) {
      this.dateRange.push(DayJs(dateMove).format('DD MMM')); // '05 May'
      dateMove.setDate(dateMove.getDate() + 1);
      days--;
    }
  }

  getSessionsForDay(day: number) {
    this.activeDay = day;
    this.activeDate = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');
    console.log(this.queryData);
    var date = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');
    if (this.centersWithSession[0][date]) {
      return;
    }
    console.log('not for this date', this.activeDate);
    if (this.queryData.queryType == this.QueryType.PIN) {
      this.getSessionsByPincode(this.queryData[this.QueryType.PIN], day);
    } else {
      this.getSessionsByDistrictId(
        this.queryData[this.QueryType.DISTRICT],
        day
      );
    }
  }

  getCentersWithPincdoe(pincode: string) {
    //get all centers with pincode
    this.vaccineRestService.centersByPinCode(pincode).subscribe((sessions) => {
      if (sessions.length > 0) {
        // this.centersSessions = sessions;
        console.log('CENTER SESSIONS', this.centersSessions);
      } else {
        console.log('no sessions found for date');
      }
    });
  }

  getCentersWithDistricId(districtId: string) {
    //get all center with district id
    this.vaccineRestService
      .centersByDistrictId(districtId)
      .subscribe((centers) => {
        //  this.centers = centers;
        if (centers.length === 0) {
          this.isCenterEmpty == true;
        }
        this.addSubscribedKeyToCenters();

        console.log('CENTERS ', centers);
      });
  }

  addSubscribedKeyToCenters() {
    // adds subscribe key to each center with true or false
    this.centers.map((center, index) => {
      var rc = this.checkIfCenterIsSelected(center);
      if (rc) {
        this.centers[index].subscribed = true;
        this.centers[index].subscriptionId = rc._id;
      } else {
        this.centers[index].subscribed = false;
      }
    });
  }

  isVisible(center: any) {
    var date = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');
    if (center[date]) {
      return true;
    } else {
      return false;
    }
  }

  mergeCenterAndSessions() {
    var date = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');
    let newArray = this.centers.map((t1) => ({
      ...t1,
      [date]: this.centersSessions.find((t2) => t2.centerId === t1._id) || [],
    }));

    this.centersWithSession = newArray;
    this.centers = newArray;
    console.log('centers with session ', this.centersWithSession);

    this.spinner.hide();
  }

  getSessionsByPincode(pincode: string, day: number) {
    this.vaccineRestService
      .getSessionsByPincode(pincode, DayJs().add(day, 'day').format('DDMMYYYY'))
      .subscribe((sessions) => {
        this.centersSessions = sessions;
        console.log('CENTER SESSIONS', this.centersSessions);
        this.mergeCenterAndSessions();
      });
  }

  getSessionsByDistrictId(districtId: string, day: number) {
    this.vaccineRestService
      .getSessionsByDistrictId(
        districtId,
        DayJs().add(day, 'day').format('DDMMYYYY')
      )
      .subscribe((sessions) => {
        this.centersSessions = sessions;
        console.log('CENTER SESSIONS', this.centersSessions);
        this.mergeCenterAndSessions();
      });
  }

  addSubscribe(center: Center) {
    if(this.accountTotalSubscribe+this.newTotalSubscribe>=this.MAXSUBSCRIPTION){
      console.log("you can nto subscribe more then 3 centers");
      this.openLimitReachedModal(this.limitReachedTemplate);
      return;
    }
    this.newSubscribeCenters.push(center);
    let index = this.centersWithSession.findIndex(
      (c: Center) => c._id === center._id
      );
      this.centersWithSession[index].subscribed = 'temp';
      this.newTotalSubscribe = this.newSubscribeCenters.length;;
  }
  removeSubscribe(center: Center) {
    let indexNew = this.newSubscribeCenters.findIndex(
      (c: Center) => c._id === center._id
    );

    let index = this.centersWithSession.findIndex(
      (c: any) => c.name === center.name
    );
    this.newSubscribeCenters.splice(indexNew, 1);
    this.centersWithSession[index].subscribed = false;

      this.newTotalSubscribe = this.newSubscribeCenters.length;;

  }


  applySubscribeChanges() {
    this.spinner.show();
    console.log('new subscribe ', this.newSubscribeCenters);
    this.subscriptionService
        .postSubscriptionCenter({ centers:this.newSubscribeCenters })
        .subscribe((data) => {
          this.spinner.hide();
          console.log('posted success ', data);
          this.router.navigate(['/auth-home']);
        });
  }
  openLimitReachedModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'limitReachedModal' }));
  }
  // subscribeCenter(center: Center) {
  //   // this.subscribedCenters.push(center);
  //   console.log(this.centersWithSession);
  //   let index = this.centersWithSession.findIndex(
  //     (c: Center) => c._id === center._id
  //   );
  //   this.centersWithSession[index].subscribed = 'temp';

  //   this.subscriptionService
  //     .postSubscriptionCenter({ centers: [center] })
  //     .subscribe((data) => {
  //       console.log('posted success ', data);
  //     });
  // }

  UnSubscribeCenter(check_center: Center) {
    let index = this.centersWithSession.findIndex(
      (c: any) => c.name === check_center.name
    );
    this.centersWithSession[index].subscribed = false;

    this.subscriptionService
      .deleteSubscriptionCenter(check_center._id)
      .subscribe((data) => {
        console.log('posted success ', data);
        let indexNew = this.subscribedCenters.findIndex(
          (c: any) => c.name === check_center.name
        );
        this.subscribedCenters.splice(indexNew,1);
        this.accountTotalSubscribe=this.subscribedCenters.length;
         });
  }

  checkIfCenterIsSelected(check_center: Center) {
    return this.subscribedCenters.find(
      (center) => check_center._id === center.centerId
    );
  }

  //filters
  changeDose(name: any): void {
    this.dose = name;
    console.log(this.dose);
  }
  //filters
  changeAge(age: any): void {
    this.age = age;
    console.log(this.age);
  }

  vaccineTypeChange(vacc:any): void {
    this.vaccineType=vacc;
  }

  //header animation
  lastScroll: number = 0;
  @HostListener('window:scroll', ['$event'])
  scrollHandler(event: any) {
    const header = this.header.nativeElement;
    const scrollUp = 'show-header';
    const scrollDown = 'hide-header';
    console.log('Scroll Event');
    const currentScroll = window.pageYOffset;
    console.log(currentScroll, window);
    if (currentScroll <= 0) {
      header.classList.remove(scrollUp);
      return;
    }

    if (
      currentScroll > this.lastScroll &&
      !header.classList.contains(scrollDown)
    ) {
      // down
      header.classList.remove(scrollUp);
      header.classList.add(scrollDown);
      console.log('adding header up');
    } else if (
      currentScroll < this.lastScroll &&
      header.classList.contains(scrollDown)
    ) {
      // up
      header.classList.remove(scrollDown);
      header.classList.add(scrollUp);
    }
    this.lastScroll = currentScroll;
  }
}
