import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Vaccine Finder';
  constructor(private storageService: LocalStorageService,
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private router: Router, private authService: AuthService) {
    this.spinner.show();
    //this.getUserStatus();
    this.titleService.setTitle('Vaccine Finder');
  }

  ngOnInit(){
    this.authService.user$.subscribe((user) => {
      if(user && user.phoneNumber) {
        this.storageService.set("User", user);
        this.router.navigate(["/home"])
      }
      this.spinner.hide();
    });
  }

}
