import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate', 
  standalone: true
})
export class CustomDatePipe implements PipeTransform {

  transform(value: string | Date | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };

    return date.toLocaleDateString('en-US', options);
  }
}