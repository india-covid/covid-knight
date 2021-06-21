import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  public isOnline:boolean=true;
  startCheck:boolean=false;
constructor() {
  window.addEventListener('online', () => this.isOnline=true);
  window.addEventListener('offline', () => this.isOnline=false);
  setTimeout(()=>{
    this.startCheck=true;
  },3000)
}

setOnline(online:boolean){
  // if(!this.startCheck){return }
  this.isOnline = online;
  if(online){
    window.location.reload();
  }
}
}
