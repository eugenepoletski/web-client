import faker from 'faker';
import { AddressInfo } from 'net';
import { Service } from '..';
import { io, httpServer } from './test_setup';

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

  describe('update an item', () => {
    it('successfully updates an item', async () => {
      const dummyItem = {
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence().slice(0, 50),
        completed: faker.datatype.boolean(),
      };
      serverSocket.on(
        'shoppingListItem:update',
        (id: string, itemUpdate: any, cb: any) => {
          cb({
            status: 'success',
            payload: dummyItem,
          });
        },
      );

      const result = await service.updateItem(dummyItem.id, {
        title: dummyItem.title,
      });

      expect(result.status).toBe('success');
      expect(result.payload).toMatchObject(dummyItem);
    });
  });
});
