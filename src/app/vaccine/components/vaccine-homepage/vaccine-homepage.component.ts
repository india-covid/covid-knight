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
    this.vaccineService.allStates$.subscribe((allStates => console.log('all states', allStates)));
    this.vaccineService.stateByStateId('60a7ba59a46a9f004c3975e7').subscribe((singleState => console.log('single state', singleState)));

  }
}
