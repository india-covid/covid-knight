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
    private titleService: Title) {
    this.spinner.show();
    this.titleService.setTitle('Vaccine Finder');
  }
  ngOnInit(){

  }
}
