import { Component, OnInit ,Input  } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-header-back',
  templateUrl: './header-back.component.html',
  styleUrls: ['./header-back.component.scss']
})
export class HeaderBackComponent implements OnInit {
  @Input() headerText: string = '';
  @Input() routeTo: string|null =null;
  active:boolean=true;

  constructor(private _location:Location,private router:Router,private route:ActivatedRoute) {
    if(router.url=='/'){
      this.active=false;
    }

   }

  ngOnInit() {
  }

    goBack(){
      console.log("ROUTING TO ",this.routeTo);
      if(this.routeTo && this.routeTo!=""){
        this.router.navigate([this.routeTo])
      }else{
         this._location.back();
      }

    }
}
