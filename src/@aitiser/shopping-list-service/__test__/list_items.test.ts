import faker from 'faker';
import { AddressInfo } from 'net';
import { Service } from '..';
import { io, httpServer } from './test_setup';

describe('shopping-list-service', () => {
  let serverSocket: any;
  let service: any;

  beforeEach(async () => {
    const { port } = httpServer.address() as AddressInfo;
    service = new Service({ baseUrl: `https://localhost:${port}` });
    io.on('connection', (socket: any) => {
      serverSocket = socket;
    });
    await service.start();
  });

  afterEach(async () => {
    await service.stop();
  });

  describe('list items', () => {
    it('successfully lists items', async () => {
      const dummyItem1 = {
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence(),
        completed: faker.datatype.boolean(),
      };
      const dummyItem2 = {
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence(),
        completed: faker.datatype.boolean(),
      };
      serverSocket.on('shoppingListItem:list', (cb: any) => {
        cb({
          status: 'success',
          payload: [dummyItem1, dummyItem2],
        });
      });

      const result = await service.listItems();

      expect(result.status).toBe('success');
      expect(result.payload).toEqual(
        expect.arrayContaining([dummyItem1, dummyItem2]),
      );
    });
  });
});
