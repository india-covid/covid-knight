import {
  Component,
  OnInit
} from '@angular/core';

export interface NAVITEM{
  label:string,
  icon:string,
  active:boolean
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  items:NAVITEM[] =[

    {
      label:"Home",
      icon:"ri-home-3-line",
      active:true
    },
    {
      label:"Contact",
      icon:"ri-contacts-line",
      active:false
    },
    {
      label:"Donate",
      icon:"ri-hand-heart-line",
      active:false
    }
  ];


  constructor() {}

  ngOnInit(): void {}
}
