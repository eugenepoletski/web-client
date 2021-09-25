import { io, Socket } from 'socket.io-client';
import { ValidationError } from '../errors';

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

  public createItem(itemInfo: ItemInfo): Promise<Item | never> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'shoppingListItem:create',
        itemInfo,
        (response: SuccessResponse<Item> | FailResponse | ErrorResponse) => {
          switch (response.status) {
            case 'success':
              resolve(response.payload);
              break;
            case 'fail':
              reject(new this.ValidationError({ reason: response.payload }));
              break;
            case 'error':
              reject(new Error(response.message));
              break;
          }
        },
      );
    });
  }

  public listItems(): Promise<Item[] | never> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'shoppingListItem:list',
        (response: SuccessResponse<Item[]> | ErrorResponse) => {
          switch (response.status) {
            case 'success':
              resolve(response.payload);
              break;
            case 'error':
              reject(new Error(response.message));
          }
        },
      );
    });
  }

  public updateItem(
    itemId: string,
    itemUpdate: ItemInfo,
  ): Promise<Item | never> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'shoppingListItem:update',
        itemId,
        itemUpdate,
        (response: SuccessResponse<Item> | FailResponse | ErrorResponse) => {
          switch (response.status) {
            case 'success':
              resolve(response.payload);
              break;
            case 'fail':
              reject(new this.ValidationError({ reason: response.payload }));
              break;
            case 'error':
              reject(new Error(response.message));
          }
        },
      );
    });
  }

  public ValidationError = ValidationError;
}
