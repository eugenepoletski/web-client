import faker from 'faker';
import { AddressInfo } from 'net';
import { io, httpServer } from './test_setup';
import { Service } from '..';

describe('shopping-list-service', () => {
  let serverSocket: any;
  let service: any;

  beforeEach(async () => {
    const { port } = httpServer.address() as AddressInfo;
    service = new Service({ baseUrl: `http://localhost:${port}` });
    io.on('connection', (socket: any) => {
      serverSocket = socket;
    });
    await service.start();
  });

  afterEach(async () => {
    await service.stop();
  });

  describe('create an item', () => {
    it('successfully creates an item', async () => {
      const randomCountOfDummyWords = faker.datatype.number({
        min: 2,
        max: 10,
      });
      const dummyItemInfo = {
        title: faker.lorem.words(randomCountOfDummyWords),
      };
      const dummyItem = {
        id: faker.datatype.uuid(),
        title: 'This title is not expected to exist at the end',
        completed: false,
      };
      serverSocket.on('shoppingListItem:create', (itemInfo: any, cb: any) => {
        cb({
          status: 'success',
          payload: {
            ...dummyItem,
            title: itemInfo.title,
          },
        });
      });

      const result = await service.createItem(dummyItemInfo);

      expect(result.status).toBe('success');
      expect(result.payload).toMatchObject({
        id: dummyItem.id,
        title: dummyItemInfo.title,
        completed: dummyItem.completed,
      });
    });

    it('rejects to create an invalid item an reports reason', async () => {
      const dummyItemInfo = {
        title: ' ',
      };
      const dummyErrorMessage = faker.lorem.sentence();
      serverSocket.on('shoppingListItem:create', (itemInfo: any, cb: any) => {
        cb({
          status: 'fail',
          payload: {
            title: dummyErrorMessage,
          },
        });
      });

      const result = await service.createItem(dummyItemInfo);

      expect(result.status).toBe('fail');
      expect(result.payload).toMatchObject({
        title: dummyErrorMessage,
      });
    });
  });
});
