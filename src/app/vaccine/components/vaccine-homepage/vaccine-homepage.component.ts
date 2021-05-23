import { Component, OnInit } from '@angular/core';
import { VaccineRestService } from '../../services/vaccine-rest.service';


@Component({
  selector: 'app-vaccine-homepage',
  templateUrl: './vaccine-homepage.component.html',
  styleUrls: ['./vaccine-homepage.component.scss']
})
export class VaccineHomepageComponent implements OnInit {
  constructor(private vaccineService: VaccineRestService){

  }
  ngOnInit(){
    this.vaccineService.centersByPinCode(560064).subscribe(console.log)
  }
}
