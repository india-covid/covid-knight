import { DOSE,VACCINES,AGE } from './../models/center.model';

import { Pipe, PipeTransform } from '@angular/core';
import { Center } from '../models/center.model';
@Pipe({
    name: 'filterCenter'
})
export class FilterCenterPipe implements PipeTransform {
 VACCINES=VACCINES;
 age='All Age';
  transform(centers: any[], hospitalName: string,dose:string,vaccineType:any,age:string,activeDate:string): any {
    let doseType:string;
    if(dose == DOSE.DOSE1){
      doseType ='1';
    }else if(dose == DOSE.DOSE2){
      doseType = '2'
    }else if(dose == DOSE.ALL){
      doseType ='all'
    }
    this.age= age;
    let result = centers.filter((center:any) => {
        if(
          this.checkCenterName(center,hospitalName,activeDate) &&
          this.checkDoseType(center,doseType,activeDate) &&
          this.checkAge(center,age,activeDate) &&
          this.vaccineType(center,vaccineType,activeDate)
         ){
          return true
        }else{
          return false;
        }

    });
    if (result.length==0){
      result = [{name:"noMatch"}];
    }
    return result;
  }

    checkCenterName(center:any,centerName:string,activeDate:string){
      return center.name.toLowerCase().includes(centerName.toLocaleLowerCase());
    }

    checkAge(center:any,age:string,activeDate:string){
     return (age!='All Age'?(this.checkSessions(center[activeDate],'minAgeLimit','===',parseInt(age)) ):true)
    }
    checkDoseType(center:any,doseType:string,activeDate:string){
      return (doseType!='all'?(this.checkSessions(center[activeDate],('availableCapacityDose'+doseType),">",0)):true);
    }

    vaccineType(center:any,vaccineType:VACCINES,activeDate:string){
      return (vaccineType!='All'?(this.checkSessions(center[activeDate],'vaccine','===',vaccineType)):true);
    }

    checkSessions(sessions:any,check:string,operator:string,operand:string|number){
      for(let i=0;i<sessions.length;i++){
        switch(operator){
          case ">":
            if(sessions[i] && sessions[i][check] && sessions[i][check]>operand &&  (this.age!=='All Age'?(sessions[i].minAgeLimit===parseInt(this.age)):true)){
              return true;
            }
            break;
          case "===":
            if(sessions[i] && sessions[i][check] && sessions[i][check]===operand){
              return true;
            }
            break;
        }

      }

      return false;
    }
 }
