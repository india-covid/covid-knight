
import { Pipe, PipeTransform } from '@angular/core';
import { Center } from '../models/center.model';

@Pipe({
    name: 'filterCenter'
})
export class FilterCenterPipe implements PipeTransform {
  transform(data: Center[], hospitalName: string,dose:string,vaccines:any): any {
    console.log("got filters ",hospitalName,dose,vaccines)

    return data;
    // return data.filter((center:Center) =>{
    //   console.log(center);
    // });
  }


 }
