import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/auth.service';
import { AlertService } from './../../services/alert.service';
import { FilterCenterPipe } from './../../pipes/filter-center.pipe';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { forkJoin, Observable, Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubscribedCenter } from './../../models/subscribedCenter';

import {
  DOSE,
  AGE,
  VACCINES,
  CenterWithSessions,
} from './../../models/center.model';
import { VaccineSession } from './../../models/vaccine-session.model';
import { SubscriptionService } from './../../services/subscription.service';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Center } from 'src/app/vaccine/models/center.model';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import * as DayJs from 'dayjs';
import { shareReplay, take, debounceTime, distinctUntilChanged, switchMap, timeout } from 'rxjs/operators';
import { trigger, style, animate, transition, useAnimation } from '@angular/animations';
import { enterAnimationLeft, enterAnimationRight } from 'src/app/core/animations/pageAnimation';
import { LocalStorageService } from 'src/app/core/localstorage.service';



export enum QueryType {
  PIN = 'pincode',
  DISTRICT = 'districtId',
}

@Component({
  selector: 'app-vaccine-slots',
  templateUrl: './vaccine-slots.component.html',
  styleUrls: ['./vaccine-slots.component.scss'],
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
export class VaccineSlotsComponent implements OnInit {
  QueryType = QueryType;
  DOSE = DOSE;
  AGE = AGE;
  VACCINES = VACCINES;
  queryData: any | null = null;
  filterComplete:boolean=false;
  readonly MAXSUBSCRIPTION: number = environment.maxSubscription;
  accountTotalSubscribe: number = 0;

  @ViewChild('header') header!: ElementRef<HTMLElement>;
  @ViewChild('limitReachedTemplate') limitReachedTemplate!: TemplateRef<any>;
  @ViewChild('slots') slots: ElementRef | null = null;
  @ViewChild('list') list: ElementRef | null = null;


    headerText:string="Select & Subscribe Centers"

   subscribedCenters: SubscribedCenter[] = [];

  private newSubscribeCenters: Center[] = [];
  newTotalSubscribe: number = 0;

  centers: Center[] = [];
  centersSessions: VaccineSession[] = [];
  centersWithSession: any[] = [];
  centersWithSessionFiltered:any[]=[];
  isCenterEmpty: boolean = false;
  showCentersList: boolean = false;

  dateRange: string[] = [];
  activeDay: number = 0;
  activeDate: string = '';
  private totalDatesToShow: number = 7;

  //filters
  dose: string = DOSE.ANY;
  vaccineType: string = this.VACCINES.ANY;
  age: string = AGE.ANY;
  hospitalName: string = '';
  hospitalUpdate = new Subject<string>();

  infiniteScrollConfig={
    throttle:10,
    scrollDistance: 1.5,
    scrollUpDistance : 1.5,
    sum:10,
    preLoad:10

  }
 user:User|null=null;
  constructor(
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private vaccineRestService: VaccineRestService,
    private spinner: NgxSpinnerService,
    private filterCenterPipe:FilterCenterPipe,
    private alertService:AlertService,
    private authService:AuthService,
    private storageService:LocalStorageService
  ) {
    this.queryData = { ...this.route.snapshot.queryParams };

    let timeoutI = setTimeout(()=>{
      this.getRouteParams(this.queryData);
    },2000);
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      clearTimeout(timeoutI);
      this.user = user;
      if(user?.phoneNumber){
        this.getSubscribedCenters();
      }else{
        this.getRouteParams(this.queryData);
      }
      this.listenHospital();
    });
  }

  mainArray:any=[];

  onScrollDown() {
    // add another 20 items
    this.infiniteScrollConfig.sum += 20;
    this.addCenters();
  }


  addCenters(){
    let count =0;
    for(let i = this.infiniteScrollConfig.sum;i<this.infiniteScrollConfig.preLoad+ this.infiniteScrollConfig.sum;i++){
      if(!this.centersWithSessionFiltered[i]){return }
      this.mainArray.push(this.centersWithSessionFiltered[i]);
      count++;
    }
    this.infiniteScrollConfig.sum+=count;
  }

  getSubscribedCenters() {
    this.spinner.show();
    this.subscriptionService.subscribedCenters$.subscribe((subscribedCenters) => {
      this.spinner.hide();
      if(!subscribedCenters){return };
      this.subscribedCenters = subscribedCenters;
      this.accountTotalSubscribe = subscribedCenters.length;
      if (!this.queryData.queryType) {
        // this.router.navigate(['/home']);
        console.log("no query data");
        this.spinner.hide();
        return;
      }
      this.getRouteParams(this.queryData); //get query type
    });

  }
  getRouteParams(params: any) {
    if (params.queryType == this.QueryType.PIN) {
      //if query type is pincode
      const centers$ = this.vaccineRestService
        .centersByPinCode(params.pincode)
        .pipe(shareReplay());
      const centersSessions$ = this.vaccineRestService.getSessionsByPincode(
        params.pincode,
        DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
      );
      this.joinFetchCenterSession(centers$, centersSessions$,params.pincode);
    } else if (params.queryType == this.QueryType.DISTRICT) {
      //if query type is district
      const centers$ = this.vaccineRestService.centersByDistrictId(
        params.districtId
      );
      const centersSessions$ = this.vaccineRestService.getSessionsByDistrictId(
        params.districtId,
        DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
      );
      this.joinFetchCenterSession(centers$, centersSessions$,params.districtId);
    }
  }

  ngOnInit() {
    this.generateDays(this.totalDatesToShow);
  }


  generateDays(days: number) {
    //generate dates from today to n days
    this.activeDate = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');
    const dateMove = new Date();
    while (days > 0) {
      this.dateRange.push(DayJs(dateMove).format('DD MMM')); // '05 May'
      dateMove.setDate(dateMove.getDate() + 1);
      days--;
    }
  }

  //fetch initial center and session
  count:number=0;
  joinFetchCenterSession(
    centers$: Observable<Center[]>,
    centersSessions$: Observable<VaccineSession[]>,
    area:string
  ) {
    forkJoin(centers$, centersSessions$).subscribe((response) => {
      // all observables have been completed
      this.centers = response[0];
      if (this.centers.length === 0) {
        this.isCenterEmpty == true;
        if(this.count<=0){
          this.alertService.noCenters(area);
        }
        this.count++;

      } else {
        this.addSubscribedKeyToCenters();
      }
      this.centersSessions = response[1];

      this.mergeCenterAndSessions();
    });
  }

  //add subscribed key on center
  addSubscribedKeyToCenters() {
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



  getSessionsByPincode(pincode: string, day: number) {
    this.vaccineRestService
      .getSessionsByPincode(pincode, DayJs().add(day, 'day').format('DDMMYYYY'))
      .subscribe((sessions) => {
        this.centersSessions = sessions;

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
        this.mergeCenterAndSessions();
      });
  }

  n:any;
  m:any;
  mergeCenterAndSessions() {
    var date = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');
    let newArray = this.centers.map((t1) => ({
      ...t1,
      [date]: this.centersSessions.map((t2) => {
        if(t2.centerId === t1._id){
          return t2;
        }
        return {minAgeLimit:false};
      }).filter((d)=>d.minAgeLimit).sort((a, b) => Number(a.minAgeLimit) - Number(b.minAgeLimit)) || [],
    }));
    newArray.sort((a,b)=>{
       this.n = a;
        this.m = b;
      let c = this.n[this.activeDate].length || 0;
      let d = this.m[this.activeDate].length || 0 ;
      return Number(d)-Number(c);
    });
    newArray.sort((a:any,b:any)=>{
      let first=0;
      let second=0;
      for(let i=0;i<a[this.activeDate]?.length;i++){
        if(a[this.activeDate][i].availableCapacity>0){
          first+=a[this.activeDate][i].availableCapacity;
        }
      }
      for(let i=0;i<b[this.activeDate]?.length;i++){
        if(b[this.activeDate][i].availableCapacity>0){
          second+=b[this.activeDate][i].availableCapacity;
        }
      }
      return Number(second)-Number(first);
   });
    this.centersWithSession = newArray;
    this.centers = newArray;

    this.spinner.hide();
    this.applyFilters();
    this.showCentersList = true;
    setTimeout(()=>{
      this.filterComplete=true;
    },1000)

  }

  getSessionsForDay(day: number) {
    this.showCentersList = false;
    this.activeDay = day;
    this.activeDate = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');

    if (this.isCenterEmpty || this.centersWithSession[0][this.activeDate]) {
      this.applyFilters();

      setTimeout(() => {
       this.showCentersList = true;
      }, 0);
      return;
    }

    if (this.queryData.queryType == this.QueryType.PIN) {
      this.getSessionsByPincode(this.queryData[this.QueryType.PIN], day);
    } else {
      this.getSessionsByDistrictId(
        this.queryData[this.QueryType.DISTRICT],
        day
      );
    }
  }


  _phoneNumber:string|undefined=undefined;
  private get _ping$() {
    return this.authService
      .ping({ phoneNumber: this._phoneNumber, centers: [] }, 'register')
  }


  registerUser() {
    let naviagationExtras: NavigationExtras = this.queryData;
    this.spinner.show();
    // this.subscribing = true;
    this._ping$.pipe(switchMap((p) => this.authService.requestOtp(this._phoneNumber?.toString())), take(1)).subscribe(results => {
      this.saveCurrentResults(this._phoneNumber, naviagationExtras);
    });
  }

  private saveCurrentResults(phoneNumber: string = '', naviagationExtras: NavigationExtras) {
    this.storageService.set('subscription', {time: new Date().getTime() / 1000, phoneNumber,  centers: [...this.newSubscribeCenters]});
    this.spinner.hide();
    this.router.navigate(['/subscription'], {queryParams:naviagationExtras});
  }


  //handle tick and untick for subscribe
  async changeSubscribe(e: any, center: Center) {


    if (e.target.checked) {
      if (
        this.accountTotalSubscribe + this.newTotalSubscribe >=
        this.MAXSUBSCRIPTION
      ) {
        e.target.checked = false;
       this.alertService.maxSubReached(this.MAXSUBSCRIPTION,this.subscribedCenters.length);
        return;
      }
      this.addSubscribe(center);
    } else {
      e.target.checked = false;
      this.removeSubscribe(center);
    }
  }

  //add to subscribe array
  addSubscribe(center: Center) {
    this.newSubscribeCenters.push(center);
    let index = this.centersWithSession.findIndex(
      (c: Center) => c._id === center._id
    );
    this.centersWithSession[index].subscribed = 'temp';
    this.newTotalSubscribe = this.newSubscribeCenters.length;
  }

  //remove from subscribe array
  removeSubscribe(center: Center) {
    let indexNew = this.newSubscribeCenters.findIndex(
      (c: Center) => c._id === center._id
    );

    let index = this.centersWithSession.findIndex(
      (c: any) => c.name === center.name
    );
    this.newSubscribeCenters.splice(indexNew, 1);
    this.centersWithSession[index].subscribed = false;

    this.newTotalSubscribe = this.newSubscribeCenters.length;
  }
  removeAllSubscribe(){
    let newSubscribe = this.newSubscribeCenters;
    for(let center of newSubscribe){
      let index = this.centersWithSessionFiltered.findIndex(
        (c: any) => c.name === center.name
      );
     // this.centersWithSessionFiltered[index].subscribed = false;

      let index2 = this.centersWithSession.findIndex(
        (c: any) => c.name === center.name
      );
      this.centersWithSession[index2].subscribed = false;
    }
    this.applyFilters();
    this.newSubscribeCenters = [];
    this.newTotalSubscribe = 0;
  }


  //apply subscribe
  async applySubscribeChanges() {
    if(!this.user?.phoneNumber){
      let result = await this.alertService.enterPhone();
      if(!result.value) {
        return;
      }
      this._phoneNumber = result.value;
      this.registerUser();
      return;
    }

    this.spinner.show();
    let centersId =this.newSubscribeCenters.map(a => a._id);
    this.subscriptionService
      .postSubscriptionCenter({ centers: centersId })
      .subscribe((data) => {
        this.spinner.hide();
        this.subscriptionService.getSubscriptionCenters();
        this.router.navigate(['/home']);
      });
  }




  checkIfCenterIsSelected(check_center: Center) {
    return this.subscribedCenters.find(
      (center) => check_center._id === center.centerId
    );
  }

  //handle filters

  changeDose(name: any): void {
    this.dose = name;
    this.applyFilters();

  }

  changeAge(age: any): void {
    this.age = age;
    this.applyFilters();

  }

  vaccineTypeChange(vacc:string): void {
    this.vaccineType = vacc;
    this.applyFilters();

  }
  listenHospital(){
    this.hospitalUpdate.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        this.hospitalName = value;
        this.applyFilters();
      });
  }


  applyFilters(){
    this.centersWithSessionFiltered = this.filterCenterPipe.transform(this.centersWithSession,this.hospitalName,this.dose,this.vaccineType,this.age,this.activeDate)
    this.mainArray =[];
    this.infiniteScrollConfig.sum=this.infiniteScrollConfig.preLoad;

    for(let i =0;i<=this.infiniteScrollConfig.preLoad;i++){
      if(!this.centersWithSessionFiltered[i]){return }
      this.mainArray.push(this.centersWithSessionFiltered[i])
    }
    setTimeout(()=>{
      let el = this.list?.nativeElement;
      el.scrollTo(0, 0);
    },100)
  }
}
