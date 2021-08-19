import { rejects } from 'assert';
import Client from 'socket.io-client';

export interface IServiceConfig {
  baseUrl: string;
}

export class Service {
  private socket: any;

  constructor({ baseUrl }: IServiceConfig) {
    this.socket = Client(baseUrl);
  }

  public start(): Promise<any> {
    return new Promise((res, rej) => {
      this.socket.on('connect', () => res({}));
    });
  }

  public stop(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.close();
      resolve({});
    });
  }

  public createItem(itemInfo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('shoppingListItem:create', itemInfo, (res) => {
        resolve({ status: 'success', payload: res.payload });
      });
    });
  }

  public listItems(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('shoppingListItem:list', (res) => {
        resolve({ status: 'success', payload: res.payload });
      });
    });
  }
}
