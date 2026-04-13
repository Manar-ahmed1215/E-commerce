import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'termLimit',
})
export class TermLimitPipe implements PipeTransform {
transform(value: string, limit: number): string {
    if (!value) return '';
    const words = value.split(' ');
    return words.length > limit 
      ? words.slice(0, limit).join(' ') + '...' 
      : value;
  }
}
