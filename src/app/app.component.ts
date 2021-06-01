import { Component, OnInit } from '@angular/core';
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
  title = 'Vaccine Finder';
  constructor(private subscriptionService: SubscriptionService,
    private storageService: LocalStorageService,
    private router: Router,
    private titleService: Title) {
    this.titleService.setTitle('Vaccine Finder');
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
}
