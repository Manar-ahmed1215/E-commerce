import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate', // يفضل تسميه اسم مختلف عن Date بتاع أنجلر عشان ميتلخبطوش
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