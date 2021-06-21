import { User } from 'src/app/core/models/user.model';
import { HostListener, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AuthService } from '../../auth.service';
import { take, catchError } from 'rxjs/operators';
import { AlertService } from 'src/app/vaccine/services/alert.service';
import { flattenDiagnosticMessageText } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  deferredPrompt: any;
  showButton = false;
  user:User|null=null;
  done:boolean=false;;
  constructor(private readonly updates: SwUpdate,private authService:AuthService,private alertService:AlertService) {
    updates.available.subscribe(event => {
      if (this.askUserToUpdate()) {
        this.updates.activateUpdate().then(() =>{
         window.location.reload();
        })
      }
    });

    this.authService.user$.pipe().subscribe((user) => {
      this.user = user;
    });

    window.addEventListener('beforeinstallprompt', event => {
      if(this.done) return;
     this.deferredPrompt = event;
      this.deferredPrompt.preventDefault();
      this.showButton = true;
      this.done=true;
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
          this.authService.ping({phoneNumber:this.user?.phoneNumber,pwaData:choiceResult},'appInstalled').subscribe((data)=>{
          },(err)=>{
          })
        } else {
          this.authService.ping({phoneNumber:this.user?.phoneNumber,pwaData:choiceResult},'appInstallDeclined').subscribe(()=>{

          })
        }
        this.deferredPrompt = null;
      });
  }

}
