import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  public transform(value: any, keys: string, term: string) {

    if (!term) {
      return value;
    }

    return (value || []).filter((item: { [x: string]: string; // @ts-ignore
      hasOwnProperty: (arg0: string) => any; }) => {
      return keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key]));
    });
  }
}
