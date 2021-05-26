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

  MENUITEMS = MENUITEMS;
  activeMenuItem:MENUITEMS=MENUITEMS.HOME;

    changeMenu(menuItem:MENUITEMS){
      this.activeMenuItem = menuItem;
    }

  constructor() {}

  ngOnInit(): void {}
}
