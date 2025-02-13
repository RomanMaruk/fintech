import { DatePipe } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './api/auth.service';
import { StateCurrentCurrencyService } from './state-current-currency.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private token: string | null | undefined =
    inject(AuthService).getAuthResponse?.access_token;
  private stateCurrency = inject(StateCurrentCurrencyService);

  private messageSubject = new BehaviorSubject<IMessage | null>(null);
  public messages$ = this.messageSubject.asObservable();

  connect() {
    if (this.token) {
      const wsUrl = `wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=${this.token}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = (ev) => {
        console.log('WebSocket connected', ev);
      };
      this.socket.onmessage = (event: MessageEvent<string>) => {
        this.handleMessage(event);
      };
      this.socket.onerror = (error) => console.error('WebSocket Error:', error);
      this.socket.onclose = () => console.log('WebSocket disconnected');
    } else {
      console.error('No token available for WebSocket connection.');
    }
  }

  subscribeToMarketData(id: string) {
    const message = {
      type: 'l1-subscription',
      id: '1',
      instrumentId: id,
      provider: 'simulation',
      subscribe: true,
      kinds: ['ask', 'bid', 'last'],
    };
    this.sendMessage(message);
  }

  // Method for sending messages through WebSocket
  sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected or closed');
    }
  }

  closeConnection() {
    if (this.socket) {
      this.socket.close();
    } else {
      console.error('WebSocket is not initialized');
    }
  }

  checkWebSocketConnection() {
    if (this.socket) {
      const isConnected = this.socket.readyState === WebSocket.OPEN;
      return isConnected;
    }
    return false;
  }

  private handleMessage(event: MessageEvent<string>) {
    const parse: IMessage = JSON.parse(event.data);

    const currentCurrency = this.stateCurrency.getValueCurrentInstrument;

    const key: PriceKeys =
      (parse.ask && 'ask') || (parse.bid && 'bid') || (parse.last && 'last');

    if (currentCurrency?.id === parse.instrumentId && key) {
      if (parse?.[key]) {
        parse[key]['price'] = (parse?.[key]?.price as number) + Math.random();
      }

      const updatedDate = new DatePipe('en-US').transform(
        parse?.[key]?.timestamp,
        'yyyy-MM-dd'
      ) as string;
      this.messageSubject.next({
        ...parse,
        [key]: { ...parse[key], timestamp: updatedDate },
      });
    }
  }
}

type PriceKeys = 'ask' | 'bid' | 'last';

export interface IMessage {
  ask: IAsk;
  bid: IAsk;
  last: IAsk;
  instrumentId: string;
  provider: string;
  type: string;
}

export interface IAsk {
  timestamp: string;
  price: number;
  volume: number;
}
