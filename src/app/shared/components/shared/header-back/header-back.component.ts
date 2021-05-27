import { Component, OnInit ,Input  } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-header-back',
  templateUrl: './header-back.component.html',
  styleUrls: ['./header-back.component.scss']
})
export class HeaderBackComponent implements OnInit {
  @Input() headerText: string = '';

  constructor(private _location:Location) { }

  ngOnInit() {
  }

    goBack(){
      this._location.back();
    }
}
