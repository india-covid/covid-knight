export interface VaccineSession {
  _id: string;
  availableCapacity: number;
  availableCapacityDose1: number;
  availableCapacityDose2: number;
  minAgeLimit: number;
  vaccine: string;
  stateId: string;
  districtId: string;
  centerId: string;
  slots: string[];
  date: string;
  // openFrom: string | Date;
  // openTo: string | Date;
}
