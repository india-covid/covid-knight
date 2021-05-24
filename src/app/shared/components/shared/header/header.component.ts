import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';

export interface MENUITEM{
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
  @ViewChild('navbarMenu') navbarMenu!: ElementRef;
  links:MENUITEM[] =[
    {
      label:"Contact",
      icon:"ri-contacts-line icon",
      active:false
    },
    {
      label:"Donate",
      icon:"ri-home-line icon",
      active:false
    },
    {
      label:"Home",
      icon:"ri-home-line icon",
      active:true
    }
  ];

  toggleNav() {
    if (this.navbarMenu.nativeElement.classList.contains('responsive')) {
      this.navbarMenu.nativeElement.classList.remove('responsive');
    } else {
      this.navbarMenu.nativeElement.classList.add('responsive');
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
