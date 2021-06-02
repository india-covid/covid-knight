import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from './core/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { Title } from '@angular/platform-browser';
import { SubscriptionService } from './vaccine/services/subscription.service';
import { take, takeLast } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild('appContainer') appContainer:ElementRef|null=null;
  title = 'Vaccine Finder';
  constructor(private subscriptionService: SubscriptionService,
    private storageService: LocalStorageService,
    private router: Router,
    private renderer:Renderer2,
    ) {
  }

  ngOnInit(){
    this.wizardCheck();
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
}
