import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { Title } from '@angular/platform-browser';
import { SubscriptionService } from './vaccine/services/subscription.service';
import { take, takeLast } from 'rxjs/operators';
import { VaccineRestService } from './vaccine/services/vaccine-rest.service';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild('appContainer') appContainer:ElementRef|null=null;
  title = 'Vaccine Finder';
  user:User|null=null;
  showSelectArea:boolean=true;
  constructor(private subscriptionService: SubscriptionService,
    private storageService: LocalStorageService,
    private router: Router,
    private vaccineRestService: VaccineRestService,
    private renderer:Renderer2,
    ) {

  }

  ngOnInit(){
    this.wizardCheck();
  }

  lastSyncTime() {
    return this.vaccineRestService.lastSyncTime();
  }


  wizardCheck() {
    this.subscriptionService.wizardResult.pipe(take(1)).subscribe(res => {
      if(res && typeof res.expired !== 'boolean') {
        this.router.navigate(['subscription'],{queryParamsHandling: 'preserve'})
      }else if(res && res.expired) {
        this.storageService.delete('subscription');
        this.router.navigate(['home']);
      }
    });
  }

    //set height dynamically
    setHeight(){
      this.renderer.setStyle(this.appContainer?.nativeElement, 'height', (window.innerHeight - 0)+"px");
    }

    ngAfterViewInit() {
     this.setHeight();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event:any) {
      this.setHeight();
    }
}
