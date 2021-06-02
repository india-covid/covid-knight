
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubscribedCenter } from './../../models/subscribedCenter';
import {  DOSE, AGE,VACCINES } from './../../models/center.model';
import { VaccineSession } from './../../models/vaccine-session.model';
import { SubscriptionService } from './../../services/subscription.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Center } from 'src/app/vaccine/models/center.model';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import * as DayJs from 'dayjs';
import { shareReplay } from 'rxjs/operators';
import { trigger, style, animate, transition } from '@angular/animations';

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
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('100ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]
    ),
    trigger(
      'enterAnimationRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('100ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]
    )
  ],
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
  @ViewChild('slots') slots:ElementRef|null=null;

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
  showCentersList:boolean=true;


  constructor(
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer:Renderer2,
    private vaccineRestService: VaccineRestService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
  ) {
    this.getSubscribedCenters();
  }

  getSubscribedCenters() {
    this.spinner.show();
    this.subscriptionService.getSubscriptionCenters().subscribe((data) => {
      this.subscribedCenters = data;
      this.accountTotalSubscribe = data.length;
      this.queryData = {...this.route.snapshot.queryParams}
      if(!this.queryData.queryType) {
        this.router.navigate(['/home']);
        this.spinner.hide();
        return;
      }

      this.getRouteParams(this.queryData);
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

        forkJoin(centers$, centersSessions$).subscribe((response) => {
          // all observables have been completed
          this.centers = response[0];
          if(this.centers.length===0){
            this.isCenterEmpty=true;
          }
          this.centersSessions = response[1];
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
          if(this.centers.length===0){
            this.isCenterEmpty==true;
          }
          this.centersSessions = response[1];
          this.mergeCenterAndSessions();
        });
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

  mergeCenterAndSessions() {
    var date = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');
    let newArray = this.centers.map((t1) => ({
      ...t1,
      [date]: this.centersSessions.find((t2) => t2.centerId === t1._id) || [],
    }));

    this.centersWithSession = newArray;
    this.centers = newArray;
    this.spinner.hide();
    this.showCentersList=true;
  }

  getSessionsForDay(day: number) {
    this.showCentersList=false;
    this.activeDay = day;
    this.activeDate = DayJs().add(this.activeDay, 'day').format('DDMMYYYY');

    if(this.isCenterEmpty || this.centersWithSession[0][this.activeDate]){
      setTimeout(()=>{
        this.showCentersList=true;

      },50);
      return
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


  addSubscribe(center: Center) {
    if(this.accountTotalSubscribe+this.newTotalSubscribe>=this.MAXSUBSCRIPTION){
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
    this.subscriptionService
        .postSubscriptionCenter({ centers:this.newSubscribeCenters })
        .subscribe((data) => {
          this.spinner.hide();
          this.router.navigate(['/home']);
        });
  }


  openLimitReachedModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'limitReachedModal' }));
  }


  UnSubscribeCenter(check_center: Center) {
    let index = this.centersWithSession.findIndex(
      (c: any) => c.name === check_center.name
    );
    this.centersWithSession[index].subscribed = false;

    this.subscriptionService
      .deleteSubscriptionCenter(check_center._id)
      .subscribe((data) => {
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

  //handle filters
  changeDose(name: any): void {
    this.dose = name;
  }

  changeAge(age: any): void {
    this.age = age;
  }

  vaccineTypeChange(vacc:any): void {
    this.vaccineType=vacc;
  }


  //set height dynamically

  setHeight(){
    this.renderer.setStyle(this.slots?.nativeElement, 'height', window.innerHeight+"px");
  }

  ngAfterViewInit() {
   this.setHeight();
  }
}
