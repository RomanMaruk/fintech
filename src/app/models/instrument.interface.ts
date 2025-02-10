export type TProvider =
  | 'active-tick'
  | 'alpaca'
  | 'cryptoquote'
  | 'dxfeed'
  | 'oanda'
  | 'simulation';

export type TPeriodicity = 'minute' | 'hour' | 'day' | 'month' | 'year';

export interface IPaging {
  page: number;
  pages: number;
  items: number;
}

export interface ITradingHours {
  regularStart: string;
  regularEnd: string;
  electronicStart: string;
  electronicEnd: string;
}

export interface IMapping {
  symbol: string;
  exchange: string;
  defaultOrderSize: number;
  tradingHours: ITradingHours;
}

export interface IMappings {
  'active-tick': IMapping;
  simulation: IMapping;
  oanda: IMapping;
}

export interface IProfile {
  name: string;
  gics: Record<string, unknown>;
}

export interface IListInstrument {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency: string;
  mappings: IMappings;
  profile: IProfile;
}

export interface IListInstrumentResponse {
  paging: IPaging;
  data: IListInstrument[];
}
