import { VaccineSession } from "./vaccine-session.model";

export interface Center {
  _id: string;
  address: string;
  blockName: string;
  districtName: string;
  stateName: string;
  feeType: FeeType;
  openFrom: string;
  openTo: string;
  long: number;
  lat: number;
  pincode: number;
  name: string;
  stateId: string;
  districtId: string;
  subscribed:boolean;
  subscriptionId:string
}



// only an ui helper
export interface CenterWithSessions extends Center{
  date:VaccineSession[];
}

export enum FeeType {
  FREE = 'Free',
  PAID = 'Paid',
  UNKNOWN = 'Unknown',
}


export enum DOSE{
  DOSE1="Dose-1",
  DOSE2="Dose-2",
  ALL="All Dose"
}
export enum AGE{
  AGE1="18",
  AGE2="45",
  ALL="All Age"
}

export enum VACCINES{
  VACCINE1="COVAXIN",
  VACCINE2="COVISHIELD",
  VACCINE3="Sputnik",
  ALL="All",

}
