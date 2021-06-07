import { AlertService } from './../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/auth.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vaccine-contact',
  templateUrl: './vaccine-contact.component.html',
  styleUrls: ['./vaccine-contact.component.scss'],
  animations: [
    trigger(
      'enterAnimationLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]
    ),
    trigger(
      'enterAnimationRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]
    )
  ],
})
export class VaccineContactComponent implements OnInit {
  @ViewChild('submitSuccess') submitSuccess!: TemplateRef<any>;

    contactTitle:string='';
    emailOrPhone:string='';
    messageText:string='';

  constructor(
    private vaccineService:VaccineRestService,
    private spinner:NgxSpinnerService,
    private authService: AuthService,
    private alertService:AlertService
    ) {
   this.authService.user$.pipe(take(1)).subscribe((user) => {
        this.emailOrPhone = user?.phoneNumber||'';
      });
    }

  ngOnInit() {
  }

    validateEmail(email:string){
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

     get isSubmitEnabled(){
      let phoneEntered = /^[0-9]*[.]?[0-9]*$/.test(this.emailOrPhone);
      let phone='';
      let email='';
      if(phoneEntered){
        phone = this.emailOrPhone;
      }else{
        email=this.emailOrPhone;
      }
      if ((this.validateEmail(email) || phone.length==10) && (this.messageText.length>0 && this.messageText.length<500)){
        return true;
      }
      return false;
    }
  submitContact(){
    this.spinner.show();
    let phoneEntered = /^[0-9]*[.]?[0-9]*$/.test(this.emailOrPhone);
    let phone='';
    let email='';
    if(phoneEntered){
      phone = this.emailOrPhone;
    }else{
      email=this.emailOrPhone;
    }
    this.vaccineService.submitForm(this.contactTitle,phone,email,this.messageText).subscribe((response)=>{
      this.spinner.hide();
      this.openSumitSuccessModal();
      this.contactTitle='';
      this.emailOrPhone='';
      this.messageText='';
    })
  }


  openSumitSuccessModal() {
    this.alertService.messageSended();
  }


}
