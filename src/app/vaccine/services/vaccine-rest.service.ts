import { Subscriptions } from './../models/subscriptions';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, ReplaySubject, } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Center } from '../models/center.model';
import { District } from '../models/district.model';
import { State } from '../models/state.model';
import { VaccineSession } from '../models/vaccine-session.model';
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
    return this.http.get<District[]>(url);
  }

  centersByDistrictId(districtId: string) {
    const url = environment.apiBase + `${this.vaccineBase}/centers/districts/${districtId}`;
    return this.http.get<Center[]>(url);
  }

  getSessionsByCenterId(centerId: string, date: string) {
    const url = environment.apiBase + `${this.vaccineBase}/sessions/${date}/center/${centerId}`;
    return this.http.get<VaccineSession[]>(url);
  }

  getSessionsByPincode(pin: string, date: string): Observable<VaccineSession[]> {
    const url = environment.apiBase + `${this.vaccineBase}/sessions/${date}/pin/${pin}`;
    return this.http.get<VaccineSession[]>(url);
  }


  getSessionsByDistrictId(districtId: string, date: string) {
    const url = environment.apiBase + `${this.vaccineBase}/sessions/${date}/district/${districtId}`;
    return this.http.get<VaccineSession[]>(url);
  }




}
