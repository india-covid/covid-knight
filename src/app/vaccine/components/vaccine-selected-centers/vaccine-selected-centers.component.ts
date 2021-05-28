import { Subscriptions } from './../../models/subscriptions';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-vaccine-selected-centers',
  templateUrl: './vaccine-selected-centers.component.html',
  styleUrls: ['./vaccine-selected-centers.component.scss']
})
export class VaccineSelectedCentersComponent implements OnInit {
  subscription!:Subscriptions;
  constructor(private storageService:LocalStorageService) {
    this.subscription = this.storageService.get('subscription');
  }

  ngOnInit() {
  }

}
