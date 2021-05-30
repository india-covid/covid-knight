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
