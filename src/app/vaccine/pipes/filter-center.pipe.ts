import { DOSE } from './../models/center.model';

import { Pipe, PipeTransform } from '@angular/core';
import { Center } from '../models/center.model';
@Pipe({
    name: 'filterCenter'
})
export class FilterCenterPipe implements PipeTransform {
  transform(centers: Center[], hospitalName: string,dose:string,vaccines:any,age:string,activeDate:string): any {
    console.log("got filters ",hospitalName,dose,vaccines,activeDate)
    let doseType:string;
    if(dose == DOSE.DOSE1){
      doseType ='1';
    }else if(dose == DOSE.DOSE2){
      doseType = '2'
    }else if(dose == DOSE.ALL){
      doseType ='all'
    }
    return centers.filter((center:any) => {
      // if(doseType=='all'){
        if(center.name.toLowerCase().includes(hospitalName.toLocaleLowerCase()) &&
          this.checkDoseType(center,doseType,activeDate) &&
         this.checkAge(center,age,activeDate)){
          return true
        }else{
          return false;
        }
      // }


    });
  }

    checkAge(center:any,age:string,activeDate:string){
     return (age!='All Age'?(center[activeDate]?center[activeDate].minAgeLimit==parseInt(age):true):true)
    }
    checkDoseType(center:any,doseType:string,activeDate:string){
      return (doseType!='all'?(center[activeDate]?center[activeDate]['availableCapacityDose'+doseType]:true):true);
    }

 }
