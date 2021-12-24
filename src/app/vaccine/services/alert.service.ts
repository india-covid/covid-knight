import { paymentUrl } from './../../core/data/razorpay.data';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
import { AuthService } from 'src/app/core/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

constructor(private router:Router,private authService:AuthService) { }

maxSubReached(maxSub:number,currentSub:number){
  Swal.fire({
    title: '<strong>Subscription Limit Reached</strong>',
    icon: 'info',
    html:
    `<div class="modal-body__title">

    Due to high running cost (messaging & servers) we can only provide <b>${maxSub}  centers</b> subscriptions per user.
    Any donations will help us remove this limit and add more features.

  </div>`,
    focusConfirm: false,
    reverseButtons: true,

    confirmButtonText:
    '<i class="ri-hand-heart-fill"></i> <b>Donate</b>',
    showDenyButton:true,
    denyButtonText:'<i class="fa fa-thumbs-down">Ok</i>',
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      window.open(paymentUrl);
    } else if (result.isDenied) {

    }
  })
}

messageSended(){

    Swal.fire({
      title: 'Message Sent',
      text:'Thank You for contacting us. We will get back to you soon',
      icon:'success',
      confirmButtonText: `OK `,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.router.navigate(['/home']);
      }
    })

}
noCenters(area:string){
  Swal.fire({
    title: `No centers found for <br> ${area}`,
    icon:'info',
    confirmButtonText: `Enter again`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.router.navigate(['/add-subscription']);
    }
  })
}


errorAlert(){
  Swal.fire({
    title: 'Error',
    text:'Some error ocurred. Please try again later.',
    icon:'error',
    confirmButtonText: `OK `,
  })
}

async enterPhone(){
  const inputAttributes: any = {
      maxlength: 10,
      pattern:"\d*",
      oninput:"javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" // quick fix
  };
     return await Swal.fire({
      title: "Register/Login",
      text: "We will send vaccine notification on whatsapp when the vaccine is available",
      input: 'number',
      inputPlaceholder: 'Enter WhatsApp Number',
      showCancelButton: true ,
      confirmButtonColor: 'green',
      confirmButtonText:'Confirm',
      reverseButtons:true,
      inputAttributes,
      position: 'top',
      inputValidator:(phoneNumber)=>{
        if(!this.validatePhoneNumber(phoneNumber)){
          return 'Please enter correct number';
        }
        return '';
      }
    })
}

 validatePhoneNumber (phoneNumber:string):boolean{
    return /^\d{10}$/.test(phoneNumber);
 }


}


