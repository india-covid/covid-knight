
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Center } from '../models/center.model';
import { State } from '../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class VaccineRestService {


  constructor(private http: HttpClient){
  }


  centersByPinCode(pin: number | string) {
    const url = environment.apiBase + `/vaccine/centers/pin/${pin}`;
    return this.http.get(url);
  }

  getStates$() {
    const url = environment.apiBase + `/vaccine/states/`;
    return this.http.get(url);
  }

  getDistrictByState$(stateId: string) {
    const url = environment.apiBase + `/vaccine/districts/states/`;
    return this.http.get(stateId);
  }



}
