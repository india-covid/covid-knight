import { Center } from 'src/app/vaccine/models/center.model';
export interface SubscribedCenter {
  center:Center
  centerId:string
  deliveryInfo: []
  from:string
  mediums:string[]
  to:string;
  userId: string;
  _id:string
  }



