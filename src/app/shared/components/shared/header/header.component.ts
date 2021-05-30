import { Router } from '@angular/router';
import {
  Component,
  OnInit
} from '@angular/core';
 enum MENUITEMS{
  HOME = 'home',
  CONTACT = 'contact',
  DONATE = 'donate'
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  active=true;
  MENUITEMS = MENUITEMS;
  activeMenuItem:MENUITEMS=MENUITEMS.HOME;

    changeMenu(menuItem:MENUITEMS){
      this.activeMenuItem = menuItem;
    }

  constructor(router:Router) {
    if(router.url!='/'){
      this.active==false;
    }

  }

  ngOnInit(): void {}
}
