import { forkJoin, timer, of, Observable, } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubscribedCenter } from './../../models/subscribedCenter';
import { AuthService } from 'src/app/core/auth.service';
import { User } from './../../../core/models/user.model';
import { CenterWithSessions } from './../../models/center.model';
import { VaccineSession } from './../../models/vaccine-session.model';
import { Subscriptions } from './../../models/subscriptions';
import { SubscriptionService } from './../../services/subscription.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Center } from 'src/app/vaccine/models/center.model';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs';
import { trigger, transition, animate, style, state, sequence } from '@angular/animations';
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
  queryData: any | null = null;

  centers$!:Observable<Center[]>;
  centersSessions$!:Observable<VaccineSession[]>;

  centers:Center[]=[];
  centersSessions:VaccineSession[]=[];

  isCenterEmpty:boolean=false;

  centersWithSession: any;
  private subscribedCenters:SubscribedCenter[]=[];
  dateRange: string[] = [];

  activeDay: number = 0;
  totalDatesToShow:number=7;

//filters
dose: string = 'Dose - 1';
  vaccineType: string = "Vaccine(2)"
  vaccines:any = {
    'COVAXIN': { name: 'COVAXIN', checked: true },
    'COVIESHIELD': { name: 'COVISHIELD', checked: true }
  }

  constructor(
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private vaccineRestService: VaccineRestService,
    private storageService: LocalStorageService,
    private authService: AuthService,
    private spinner:NgxSpinnerService
  ) {
    this.spinner.show();
    this.getSubscribedCenters();
  }

  async getSubscribedCenters() {
  this.subscriptionService.getSubscriptionCenters().subscribe((data)=>{
    this.subscribedCenters = data;
    this.getRouteParams();
  })

  }


  getRouteParams() {
    this.route.queryParams.subscribe((params) => {
      this.queryData = params;
      if (params.queryType == this.QueryType.PIN) {
        //if query type is pincode
        const centers$=  this.vaccineRestService.centersByPinCode(params.pincode).pipe(shareReplay());;//this.getCentersWithPincdoe(params[this.QueryType.PIN]);
       const centersSessions$ = this.vaccineRestService
        .getSessionsByPincode(params.pincode, DayJs().add(this.activeDay, 'day').format('DDMMYYYY'));;//this.getSessionsByPincode(params[this.QueryType.PIN], this.activeDay);

        forkJoin(centers$, centersSessions$).subscribe(response => {
          // all observables have been completed
          this.centers=response[0];
          this.centersSessions=response[1];
          console.log("got both ",this.centers,this.centersSessions);
          this.mergeCenterAndSessions();
        });
      }
      else if (params.queryType == this.QueryType.DISTRICT) {
        //if query type is district
       const centers$ = this.vaccineRestService
        .centersByDistrictId(params.districtId);
       const centersSessions$ =  this.vaccineRestService
        .getSessionsByDistrictId(
          params.districtId,
          DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
        )
        forkJoin(centers$, centersSessions$).subscribe(response => {
          // all observables have been completed
          this.centers=response[0];
          this.centersSessions=response[1];
          console.log("got both ",this.centers,this.centersSessions);
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
    const dateMove = new Date();
    while (days > 0) {
      this.dateRange.push(DayJs(dateMove).format('DD MMM')); // '05 May'
      dateMove.setDate(dateMove.getDate() + 1);
      days--;
    }
  }


  getSessionsForDay(day: number) {
    this.activeDay = day;
    console.log(this.queryData);
    var date =  DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
    if(this.centersWithSession[0][date]){
      return
    }
    if(this.queryData.queryType==this.QueryType.PIN){
      this.getSessionsByPincode(this.queryData[this.QueryType.PIN], day);
    }else{
      this.getSessionsByDistrictId(this.queryData[this.QueryType.DISTRICT], day);
    }

  }


  getCentersWithPincdoe(pincode: string){
    //get all centers with pincode
    this.vaccineRestService.centersByPinCode(pincode).subscribe((sessions) => {
      if(sessions.length>0){
       // this.centersSessions = sessions;
        console.log('CENTER SESSIONS', this.centersSessions);

      }else{
        console.log("no sessions found for date");
      }

    });
  }

  getCentersWithDistricId(districtId: string) {
    //get all center with district id
    this.vaccineRestService
      .centersByDistrictId(districtId)
      .subscribe((centers) => {
      //  this.centers = centers;
        if(centers.length===0){
          this.isCenterEmpty==true;
        }
        this.addSubscribedKeyToCenters();

        console.log('CENTERS ', centers);
      });
  }

  addSubscribedKeyToCenters() {
    // adds subscribe key to each center with true or false
    this.centers.map((center, index) => {
      var rc=this.checkIfCenterIsSelected(center);
      if (rc) {
        this.centers[index].subscribed = true;
        this.centers[index].subscriptionId = rc._id;
      } else {
        this.centers[index].subscribed = false;
      }
    });
  }

  isVisible(center:any){
    var date =  DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
      if(center[date]){
        return true;
      }else{
        return false;
      }
  }
  getAgeLimit(center:any){
    var date =  DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
      return center[date]?center[date].minAgeLimit+"+":'-';
  }
  getAvailableCapacity(center:any){
    var date =  DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
    return center[date]?.availableCapacity || 'No Slots' ;
  }

  async mergeCenterAndSessions() {
    while(!this.centers){

    }
    var date =  DayJs().add(this.activeDay, 'day').format('DDMMYYYY')
    let newArray  = this.centers.map(t1 => ({...t1, [date]:this.centersSessions.find(t2 => t2.centerId === t1._id)||null}));

    this.centersWithSession = newArray;
    this.centers = newArray;
    console.log("centers with session ",this.centersWithSession);
    this.spinner.hide();
  }



  getSessionsByPincode(pincode: string, day: number){
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

  subscribeCenter(center: Center) {
    // this.subscribedCenters.push(center);
    console.log(this.centersWithSession);
    let index = this.centersWithSession.findIndex(
      (c: Center) => c._id === center._id
    );
    this.centersWithSession[index].subscribed = true;

      this.subscriptionService.postSubscriptionCenter({centers:[center]}).subscribe((data)=>{
        console.log("posted success ",data)
      })

  }

  UnSubscribeCenter(check_center: Center) {
    let index = this.centersWithSession.findIndex(
      (c: any) => c.name === check_center.name
    );
    this.centersWithSession[index].subscribed = false;

    this.subscriptionService.deleteSubscriptionCenter(check_center.subscriptionId).subscribe((data)=>{
      console.log("posted success ",data)
    })

  }

  checkIfCenterIsSelected(check_center: Center) {
    return this.subscribedCenters.find(
      (center) => check_center._id === center.centerId
    );
  }



  //filters
  changeDose(name:any):void{
    this.dose = name;
    console.log(this.dose);
  }
  vaccineTypeChange():void {
    let all = true;
    for (let key in this.vaccines) {
      if (!this.vaccines[key].checked) {
        all = false;
      }
    }
    if (all) {
      this.vaccineType = 'Vaccine(2)';
    } else {
      if (this.vaccines['COVAXIN'].checked) {
        this.vaccineType = 'COVAXIN';

      } else if (this.vaccines['COVIESHIELD'].checked) {
        this.vaccineType = 'COVIESHIELD';
      } else {
        this.vaccineType = 'Vaccine(0)';
      }
    }
    console.log(this.vaccines);
  }
}
