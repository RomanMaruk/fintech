import { Injectable, inject } from '@angular/core';
import { AuthService } from './api/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private token: string | null = inject(AuthService).token;

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
        const parse: IMessage = JSON.parse(event.data);

        if (
          parse.ask &&
          this.messageSubject.value?.instrumentId !== parse.instrumentId
        ) {
          const updatedDate = new DatePipe('en-US').transform(
            parse.ask.timestamp,
            'yyyy-MM-dd'
          ) as string;
          this.messageSubject.next({
            ...parse,
            ask: { ...parse.ask, timestamp: updatedDate },
          });
        }
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
}

export interface IMessage {
  ask?: IAsk;

  instrumentId: string;
  provider: string;
  type: string;
}

export interface IAsk {
  timestamp: string;
  price: number;
  volume: number;
}
