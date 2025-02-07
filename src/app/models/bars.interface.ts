import { TPeriodicity, TProvider } from './instrument.interface';

export interface IDataRange {
  data: IRange[];
}

export interface IRange {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export interface IGetRangeBars {
  instrumentId: string;
  provider: TProvider;
  interval: number;
  periodicity: TPeriodicity;
  startDate: string;
  endDate?: string;
}

export interface IGetBars {
  instrumentId: string;
  provider: TProvider;
  interval: number;
  periodicity: TPeriodicity;
  barsCount: number;
}

export interface IGetTimeBackBars {
  instrumentId: string;
  provider: TProvider;
  interval: number;
  periodicity: TPeriodicity;
  timeBack: string;
}
