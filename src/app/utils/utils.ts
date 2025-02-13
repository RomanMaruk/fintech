import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';

export const milisecondToMinute = (mil: number): number => {
  return mil / 1000 / 60;
};

export const transformDateToYMD = (date: Date | string): string => {
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(date, 'yyyy-MM-dd') as string;
};
