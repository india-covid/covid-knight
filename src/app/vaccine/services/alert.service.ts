import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

constructor(private router:Router) { }

hello(){
  Swal.fire('Hello User!')
}

maxSubReached(maxSub:number,currentSub:number){
  Swal.fire({
    title: '<strong>Subscription Limit Reached</strong>',
    icon: 'info',
    html:
    `<div class="modal-body__title">
    <b>
      Due to high running cost (messaging, servers ,etc..) we can only give
       ${maxSub}  center subscriptions per user. (${currentSub}
       center already subscribed with your account).If you would like us to
      serve you more please donate.
    </b>
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
      window.open("https://rzp.io/l/vaccinewatcher");
    } else if (result.isDenied) {

    }
  })
}

messageSended(){

    Swal.fire({
      title: 'Message Sended',
      text:'Thank You for contacting us. We have got your message. We will respond you soon.',
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
}
