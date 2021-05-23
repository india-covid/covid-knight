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
}
export enum FeeType {
  FREE = 'Free',
  PAID = 'Paid',
  UNKNOWN = 'Unknown',
}
