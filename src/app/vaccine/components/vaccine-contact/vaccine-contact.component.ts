import { NgxSpinnerService } from 'ngx-spinner';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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

    //modal
  modalRef!: BsModalRef;
  modalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(private vaccineService:VaccineRestService,
    private modalService: BsModalService,
    private spinner:NgxSpinnerService,
    private authService: AuthService,
    ) {
   this.authService.user$.pipe(take(1)).subscribe((user) => {
        this.emailOrPhone = user?.phoneNumber||'';
      });
    }

  ngOnInit() {
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
      this.openSumitSuccessModal(this.submitSuccess);
      this.contactTitle='';
      this.emailOrPhone='';
      this.messageText='';
      window.location.href="#home";
    })
  }


  openSumitSuccessModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'submitSuccessModel' })
    );
  }


}
