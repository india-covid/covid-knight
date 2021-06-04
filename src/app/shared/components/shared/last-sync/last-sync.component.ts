import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-last-sync',
  templateUrl: './last-sync.component.html',
  styleUrls: ['./last-sync.component.scss']
})
export class LastSyncComponent implements OnInit {

  constructor(private vaccineRestService:VaccineRestService) { }

  ngOnInit() {
  }
  lastSyncTime() {
    return this.vaccineRestService.lastSyncTime();
  }
}
