
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, ReplaySubject, } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Center } from '../models/center.model';
import { State } from '../models/state.model';
@Injectable({
  providedIn: 'root'
})
export class VaccineRestService {

  private readonly vaccineBase = '/vaccine'
  private _stateByStateIdSubject = new ReplaySubject<{ [stateId: string]: State }>();
  private _stateSubject = new ReplaySubject<State[]>();

  constructor(private http: HttpClient) {
    this._prefetchStates();
  }


  centersByPinCode(pin: number | string): Observable<Center[]> {
    const url = environment.apiBase + `${this.vaccineBase}/centers/pin/${pin}`;
    return this.http.get<Center[]>(url);
  }

  private _prefetchStates() {
    const url = environment.apiBase + `${this.vaccineBase}/states/`;
    this.http.get<State[]>(url).subscribe(states => {
      this._stateSubject.next(states);
      const stateByStateId: { [key: string]: State } = {};
      for (const state of states) {
        stateByStateId[state._id] = state;
      }
      this._stateByStateIdSubject.next(stateByStateId);
    });
  }

  get allStates$() {
    // @ts-ignore
    return this._stateSubject.asObservable();
  }

  stateByStateId(stateId: string) {
    return this._stateByStateIdSubject.asObservable();
  }

  get allStatesByStateId() {
    return this._stateByStateIdSubject.asObservable();
  }

  getDistrictByState$(stateId: string) {
    const url = environment.apiBase + `${this.vaccineBase}/districts/states/${stateId}`;
    return this.http.get(url);
  }



}
