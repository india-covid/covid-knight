import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { Title } from '@angular/platform-browser';
import { SubscriptionService } from './vaccine/services/subscription.service';
import { take, takeLast } from 'rxjs/operators';
import { VaccineRestService } from './vaccine/services/vaccine-rest.service';
import { User } from './core/models/user.model';
import { PwaService } from './core/services/pwa/pwa.service';
import { ConnectionService } from './core/services/connection/connection.service';
import { Meta } from '@angular/platform-browser';

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
    public Pwa:PwaService,
    public conService:ConnectionService,
    private spinner:NgxSpinnerService,
    private meta: Meta
    ) {
      this.meta.addTags([
        {name: 'description', content: 'Get vaccine availability alerts on your WhatsApp for free'},
      ]);
  }

  ngOnInit(){
    this.wizardCheck();
  }

  lastSyncTime() {
    return this.vaccineRestService.lastSyncTime();
  }


  wizardCheck() {
   // this.spinner.show();
    this.subscriptionService.wizardResult.pipe(take(1)).subscribe(res => {
      if(res && typeof res.expired !== 'boolean') {
        this.router.navigate(['subscription'],{queryParamsHandling: 'preserve'});
        this.spinner.hide();
      }else if(res && res.expired) {
        this.storageService.delete('subscription');
        this.spinner.hide();
        this.router.navigate(['/home']);
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
    tryAgain(){
      window.location.reload();
    }
}
