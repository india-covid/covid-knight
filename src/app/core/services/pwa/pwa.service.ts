import { User } from 'src/app/core/models/user.model';
import { HostListener, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AuthService } from '../../auth.service';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/vaccine/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  deferredPrompt: any;
  showButton = false;
  user:User|null=null;

  constructor(private readonly updates: SwUpdate,private authService:AuthService,private alertService:AlertService) {
    updates.available.subscribe(event => {
      if (this.askUserToUpdate()) {
        this.updates.activateUpdate().then(() =>{
         window.location.reload();
        })
      }
    });

    this.authService.user$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });

    window.addEventListener('beforeinstallprompt', event => {
     this.deferredPrompt = event;
      this.deferredPrompt.preventDefault();
      this.showButton = true;

    });

  }

  askUserToUpdate(){
    return true;
  }



  addToHomeScreen(e:any) {
    this.showButton = false;
    if(!this.deferredPrompt){
      this.alertService.errorAlert();
      return;
    }
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice
      .then((choiceResult:any) => {
        if (choiceResult.outcome === 'accepted') {
          this.authService.ping({phoneNumber:this.user?.phoneNumber},'appInstalled');
        } else {
          this.authService.ping({phoneNumber:this.user?.phoneNumber},'appInstallDeclined');
        }
        this.deferredPrompt = null;
      });
  }

}
