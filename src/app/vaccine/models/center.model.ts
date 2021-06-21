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
  ANY="Any Dose",
  DOSE1="Dose-1",
  DOSE2="Dose-2",
}
export enum AGE{
  AGE1="18",
  ANY="Any Age",
  AGE2="30",
  AGE3="45",
}

export enum VACCINES{
  ANY="Any",
  VACCINE1="COVAXIN",
  VACCINE2="COVISHIELD",
  VACCINE3="Sputnik",
}
