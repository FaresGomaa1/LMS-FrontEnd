import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationToMinutes'
})
export class DurationToMinutesPipe implements PipeTransform {
  transform(duration: string): number {
    const [hours, minutes, seconds] = duration.split(':');
    const hoursInMinutes = parseInt(hours) * 60;
    const totalMinutes = hoursInMinutes + parseInt(minutes);

    return totalMinutes;
  }
}
