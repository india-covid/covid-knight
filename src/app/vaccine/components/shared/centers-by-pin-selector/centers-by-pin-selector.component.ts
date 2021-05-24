import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { isNonEmptyArray } from 'src/app/core/utils';
import { Center } from 'src/app/vaccine/models/center.model';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';

@Component({
  selector: 'app-centers-by-pin-selector',
  templateUrl: './centers-by-pin-selector.component.html',
  styleUrls: ['./centers-by-pin-selector.component.scss'],
})
export class CentersByPinSelectorComponent implements OnInit, OnChanges {


  @Input() pincodeLength = 6;
  @Output() centersSelected = new EventEmitter<{ centers: Center[], pincode: string }>()
  @Input() pincode: string = '';
  private _pincodeChangedSubject = new Subject<string>();
  centers$: Observable<Center[]>;
  selectedCenters: Center[] = []

  constructor(private vaccineRestService: VaccineRestService) {
    this.centers$ = this._pincodeChangedSubject.asObservable()
      .pipe(distinctUntilChanged(),
        debounceTime(50),
        switchMap((pin) => this.vaccineRestService.centersByPinCode(pin)));
  }

  ngOnInit(): void {
    this.refreshCenters();
  }

  refreshCenters(pin?: string) {
    pin = pin || this.pincode;
    if (!pin || (pin.length !== this.pincodeLength)) {
      if (isNonEmptyArray(this.selectedCenters)) {
        this.centersSelected.emit({ pincode: this.pincode, centers: (this.selectedCenters = []) });
      };
      return;
    }
    this._pincodeChangedSubject.next(pin);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshCenters();
  }

  onCenterSelected(centers: Center[]) {
    this.centersSelected.emit({ pincode: this.pincode, centers })
  }

}
