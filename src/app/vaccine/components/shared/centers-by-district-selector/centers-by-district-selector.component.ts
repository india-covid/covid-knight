import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Center } from 'src/app/vaccine/models/center.model';
import { District } from 'src/app/vaccine/models/district.model';
import { State } from 'src/app/vaccine/models/state.model';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';

@Component({
  selector: 'app-centers-by-district-selector',
  templateUrl: './centers-by-district-selector.component.html',
  styleUrls: ['./centers-by-district-selector.component.scss'],
})
export class CentersByDistrictSelectorComponent implements OnInit {

  @Input() selectedState: null | State = null;
  @Input() selectedDistrict: District | null = null;
  @Output() centersSelected = new EventEmitter<{ centers: Center[], districtId?: string }>()

  private _stateSubject = new Subject<string>();
  private _districtSubject = new Subject<string>();
  districts$: Observable<District[]>
  centers$: Observable<Center[]>
  selectedCenters: Center[] = [];


  constructor(private vaccineRestService: VaccineRestService) {
    this.districts$ = this._stateSubject.pipe(tap(() => this.selectedCenters = []),switchMap(stateId => this.vaccineRestService.getDistrictByState$(stateId)));
    this.centers$ = this._districtSubject.pipe(switchMap(districtId => this.vaccineRestService.centersByDistrictId(districtId)));
  }

  ngOnInit(): void {

  }

  get allStates$() {
    return this.vaccineRestService.allStates$;
  }

  onStateChange(state: State) {
    this._stateSubject.next(state._id);
    this.selectedDistrict = null;
    this.onCenterChange([]);
  }

  onDistrictChange(district: District) {
    this._districtSubject.next(district._id);
    //this.onCenterChange([]);
  }

  onCenterChange(centers: Center[]) {
    this.centersSelected.emit({centers, districtId: this.selectedDistrict?._id})
  }

}
