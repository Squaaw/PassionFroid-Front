import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitByComma'
})
export class SplitByCommaPipe implements PipeTransform {

  transform(val:string, separator:string, isExtension: boolean ): string {
    if(!val)
      return ''
    
    return isExtension ? val.split(separator)[1] : val.split(separator)[0];
  }
}