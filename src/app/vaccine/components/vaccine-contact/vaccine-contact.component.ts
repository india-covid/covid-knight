import { NgxSpinnerService } from 'ngx-spinner';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-vaccine-contact',
  templateUrl: './vaccine-contact.component.html',
  styleUrls: ['./vaccine-contact.component.scss']
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
    private spinner:NgxSpinnerService
    ) { }

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
