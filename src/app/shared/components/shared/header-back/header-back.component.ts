import { Router } from '@angular/router';
import { Component, OnInit ,Input  } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-header-back',
  templateUrl: './header-back.component.html',
  styleUrls: ['./header-back.component.scss']
})
export class HeaderBackComponent implements OnInit {
  @Input() headerText: string = '';
  @Input() routeTo: string = '';

  constructor(private _location:Location,private router:Router) { }

  ngOnInit() {
  }

    goBack(){
      console.log("ROUTING TO ",this.routeTo);
      this.router.navigate([this.routeTo])
      // this._location.back();
    }
}
