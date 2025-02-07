import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private token: string =
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTUDJFWmlsdm8zS2g3aGEtSFRVU0I3bmZ6dERRN21tb3M3TXZndlI5UnZjIn0.eyJleHAiOjE3Mzg5NDM5MTcsImlhdCI6MTczODk0MjExNywianRpIjoiMzcxOTM0YmMtMmJjMy00MGFkLWJiOWMtNDY0N2NiM2UzNjUxIiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6WyJuZXdzLWNvbnNvbGlkYXRvciIsImJhcnMtY29uc29saWRhdG9yIiwidHJhZGluZy1jb25zb2xpZGF0b3IiLCJlZHVjYXRpb24iLCJjb3B5LXRyYWRlci1jb25zb2xpZGF0b3IiLCJwYXltZW50cyIsIndlYi1zb2NrZXRzLXN0cmVhbWluZyIsInVzZXItZGF0YS1zdG9yZSIsImFsZXJ0cy1jb25zb2xpZGF0b3IiLCJ1c2VyLXByb2ZpbGUiLCJpbnN0cnVtZW50cy1jb25zb2xpZGF0b3IiLCJhY2NvdW50Il0sInN1YiI6Ijk1ZTY2ZGJiLTQ3YTctNDhkOS05ZGZlLTRlYzZjZTQxY2I0MSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFwcC1jbGkiLCJzaWQiOiJkNWU4MTZiYy04Njc3LTRkNjEtOWI5Yy05NDA2MTY2OWYwNTciLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1maW50YXRlY2giLCJ1c2VycyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSIsInJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZmludGF0ZWNoIiwidXNlcnMiXSwiZW1haWwiOiJyX3Rlc3RAZmludGF0ZWNoLmNvbSJ9.DEx1irGssC4Hv5tde00gUGqGEE2CWRbMvo7OcU5TtMW12YOZqdqZOg_cwN4rrKAOjBzvacFXy8FqXQgUuvi5fXijNSG5Ac6V2_KKmcHUiPdsXDexJ0WohhRKphHi4boSKqacy4X4vwdQ90tQZHyJLOhLxc3bNizyUKi3FnFRDI46xXcnZCPjNtVfagCNgk7RQHZuYuRwab_Q0s4MsuGRIfL7q_EQnSzCTkgJVsPeG1Ek4Asqokl5bdt9e4Seni5h226BBiRkHQxzvx146kdfLws9lRzu6maOUS4bFtdC0MJYo5m9lTwpIJogpb_6Ej_1_yHt2puJI2WxX7q6fnWscg'; // Токен доступу (отриманий через авторизацію)

  connect() {
    if (this.token) {
      const wsUrl = `wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=${this.token}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = (ev) => {
        console.log('WebSocket connected', ev);
      };
      this.socket.onmessage = (event) =>
        console.log('Message received:', event.data);
      this.socket.onerror = (error) => console.error('WebSocket Error:', error);
      this.socket.onclose = () => console.log('WebSocket disconnected');
    } else {
      console.error('No token available for WebSocket connection.');
    }
  }

  subscribeToMarketData() {
    const message = {
      type: 'l1-subscription',
      id: '1',
      instrumentId: 'ad9e5345-4c3b-41fc-9437-1d253f62db52',
      provider: 'simulation',
      subscribe: true,
      kinds: ['last'],
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

  // Метод для оновлення токена (для авторизації)
  setToken(token: string) {
    this.token = token;
  }
}
