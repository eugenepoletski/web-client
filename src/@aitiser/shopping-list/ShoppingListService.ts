import Client from 'socket.io-client';

export interface IServiceConfig {
  baseUrl: string;
}

export interface IServiceSuccesResponse<T> {
  status: 'success';
  payload: T;
}

export interface IServiceFailResponse {
  status: 'fail';
  payload: {
    [name: string]: string;
  };
}

export interface IServiceErrorResponse {
  status: 'error';
  message: string;
}

export type IServiceResponse<T> =
  | IServiceSuccesResponse<T>
  | IServiceFailResponse
  | IServiceFailResponse;

export interface IItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface IItemInfo {
  title: string;
}

export class Service {
  private socket: any;

  constructor({ baseUrl }: IServiceConfig) {
    this.socket = Client(baseUrl, {
      autoConnect: false,
    });
  }

  public start(): Promise<any> {
    return new Promise((res, rej) => {
      this.socket.on('connect', () => res({}));
      this.socket.connect();
    });
  }

  public stop(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.close();
      resolve({});
    });
  }

  public createItem(itemInfo: IItemInfo): Promise<IServiceResponse<IItem>> {
    return new Promise((resolve, reject) => {
      this.socket.emit('shoppingListItem:create', itemInfo, (res: any) => {
        resolve({ status: 'success', payload: res.payload });
      });
    });
  }

  public listItems(): Promise<IServiceResponse<IItem[]>> {
    return new Promise((resolve, reject) => {
      this.socket.emit('shoppingListItem:list', (res: any) => {
        resolve({ status: 'success', payload: res.payload });
      });
    });
  }
}
