import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConverTimeService {
  constructor() {}

  convertMinToTime(Min: number): string {
    let hr = 0;
    let min = 0;
    let sec = 0;
    if (Min % 60 === 0) {
      hr = Math.floor(Min / 60);
    } else {
      min = Min % 60;
      hr = Math.floor(Min / 60);
      sec = Math.round((Min - Math.floor(Min)) * 60);
    }
    return `${hr}:${min}:${sec}`;
  }

  convertTimeToMin(hr: number, min: number, sec: number): number {
    let Min = 0;
    sec = sec / 60;
    Min = hr * 60 + min + sec;
    return Min;
  }
}
