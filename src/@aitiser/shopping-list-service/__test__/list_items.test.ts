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

      expect(result).toEqual(expect.arrayContaining([dummyItem1, dummyItem2]));
    });

    it('rejects to list items and reports an error when an error occured', async () => {
      const dummyErrorMessage = faker.lorem.sentence();
      serverSocket.on('shoppingListItem:list', (cb: any) => {
        cb({
          status: 'error',
          message: dummyErrorMessage,
        });
      });

      expect.assertions(2);

      try {
        await service.listItems();
      } catch (err: any) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err).toBeInstanceOf(Error);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err.message).toBe(dummyErrorMessage);
      }
    });
  });
});
