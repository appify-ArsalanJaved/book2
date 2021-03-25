import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formateDate'
})
export class FormateDatePipe implements PipeTransform {

  transform(value: any): unknown {
    return new Date(value).toLocaleDateString();
    // var date = new Date(value)
    // return date['dateFormat'](Date['patterns'].LongDatePattern).slice(0,date['dateFormat'](Date['patterns'].LongDatePattern).lastIndexOf(','));
  }

}
