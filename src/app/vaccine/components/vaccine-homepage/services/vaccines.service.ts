import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  public getCentersByPin(pin: any) {
    return this.http.get(environment.centersByPinURL + pin);
  }

  public getStates() {
    return this.http.get(environment.statesURL);
  }
  getDistrict(_id: any){
    return this.http.get(environment.districtURL+_id);
  }
  getCentersByDistrict(_id: any){
    return this.http.get(environment.centersByDistrictUrl+_id);
  }
}
