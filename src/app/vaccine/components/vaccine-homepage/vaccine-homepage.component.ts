import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VaccineRestService } from '../../services/vaccine-rest.service';


@Component({
  selector: 'app-vaccine-homepage',
  templateUrl: './vaccine-homepage.component.html',
  styleUrls: ['./vaccine-homepage.component.scss']
})
export class VaccineHomepageComponent implements OnInit {
  constructor(private vaccineService: VaccineRestService, private router: Router){

  }
  ngOnInit(){

  }

  wizardDone() {
    this.router.navigate(['subscription']);
  }
}
