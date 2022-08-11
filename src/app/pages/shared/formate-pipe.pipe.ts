import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatePipe'
})
export class FormatePipePipe implements PipeTransform {

  transform(dateJson: any, args?: any): unknown {
    return dateJson;
  }

}
