
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

  private readonly vaccineBase = '/vaccine'

  constructor(private http: HttpClient){
  }


  centersByPinCode(pin: number | string): Observable<Center[]> {
    const url = environment.apiBase + `${this.vaccineBase}/centers/pin/${pin}`;
    return this.http.get<Center[]>(url);
  }

  getStates$() {
    const url = environment.apiBase + `${this.vaccineBase}/states/`;
    return this.http.get(url);
  }

  getDistrictByState$(stateId: string) {
    const url = environment.apiBase + `${this.vaccineBase}/districts/states/`;
    return this.http.get(stateId);
  }



}
