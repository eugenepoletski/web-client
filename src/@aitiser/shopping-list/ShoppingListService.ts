import { io, Socket } from 'socket.io-client';

export interface ServiceConfig {
  baseUrl: string;
}

export interface SuccessResponse<T> {
  status: 'success';
  payload: T;
}

export interface FailResponse {
  status: 'fail';
  payload: {
    [name: string]: string;
  };
}

export interface ErrorResponse {
  status: 'error';
  message: string;
}

export type Response<T> = SuccessResponse<T> | FailResponse | ErrorResponse;

export interface Item {
  id: string;
  title: string;
  completed: boolean;
}

export interface ItemInfo {
  title: string;
  completed?: boolean;
}

export class Service {
  private socket: Socket;

  constructor({ baseUrl }: ServiceConfig) {
    this.socket = io(baseUrl, {
      autoConnect: false,
    });
  }

  public start(): Promise<void> {
    return new Promise((res, rej) => {
      this.socket.on('connect', () => res());
      this.socket.connect();
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.close();
      resolve();
    });
  }

  public createItem(
    itemInfo: ItemInfo,
  ): Promise<SuccessResponse<Item> | FailResponse> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'shoppingListItem:create',
        itemInfo,
        (response: SuccessResponse<Item> | FailResponse) => {
          switch (response.status) {
            case 'success':
              resolve({ status: 'success', payload: response.payload });
              break;
            case 'fail':
              resolve({ status: 'fail', payload: response.payload });
              break;
          }
        },
      );
    });
  }

  public listItems(): Promise<SuccessResponse<Item[]>> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'shoppingListItem:list',
        (res: SuccessResponse<Item[]>) => {
          resolve({ status: 'success', payload: res.payload });
        },
      );
    });
  }
}
