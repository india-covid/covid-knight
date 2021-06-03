import { District } from 'src/app/vaccine/models/district.model';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { isNonEmptyArray } from 'src/app/core/utils';
import { Center } from 'src/app/vaccine/models/center.model';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import { LocalStorageService } from 'src/app/core/localstorage.service';
@Component({
  selector: 'app-centers-by-pin-selector',
  templateUrl: './centers-by-pin-selector.component.html',
  styleUrls: ['./centers-by-pin-selector.component.scss'],
})
export class CentersByPinSelectorComponent implements OnInit, OnChanges {


  @Input() pincodeLength = 6;
  @Output() centersSelected = new EventEmitter<{ centers: Center[], pincode: string }>()
  @Output() pinEntered = new EventEmitter<{ pincode:string }>()

  @ViewChild('selector') selector!:ElementRef;
  @ViewChild('pinInput') pinInput!: ElementRef;

  @Input() pincode: string = '';
  private _pincodeChangedSubject = new Subject<string>();
  centers$: Observable<Center[]>;
  selectedCenters: Center[] = []

  constructor(private vaccineRestService: VaccineRestService,
     private storageService: LocalStorageService) {
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
      return;
    }
    this._pincodeChangedSubject.next(pin);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshCenters();
  }

  onCenterSelected(centers: Center[]) {
    this.centersSelected.emit({ pincode: this.pincode, centers });
  }
  pinChange(pincode:string){
    if(pincode.length===6){
      this.pinInput.nativeElement.blur()
    }
    this.pinEntered.emit({ pincode: pincode });
  }
  scrollToBottom() {
    let el = this.selector.nativeElement;
    // el.scrollIntoView();
  }
}
