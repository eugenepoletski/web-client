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

      expect(result).toMatchObject({
        id: dummyItem.id,
        title: dummyItemInfo.title,
        completed: dummyItem.completed,
      });
    });

    it('rejects to create an invalid item and reports reason', async () => {
      const dummyInvalidItemInfo = {
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

      expect.assertions(2);

      try {
        await service.createItem(dummyInvalidItemInfo);
      } catch (err: any) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err).toBeInstanceOf(service.ValidationError);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err.reason).toMatchObject({
          title: dummyErrorMessage,
        });
      }
    });

    it('rejects to create an item and reports an error when an error occured', async () => {
      const dummyItemInfo = { title: faker.lorem.sentence().slice(0, 50) };
      const dummyErrorMessage = faker.lorem.sentence();
      serverSocket.on(
        'shoppingListItem:create',
        (createItemInfo: any, cb: any) => {
          cb({
            status: 'error',
            message: dummyErrorMessage,
          });
        },
      );

      expect.assertions(2);

      try {
        await service.createItem(dummyItemInfo);
      } catch (err: any) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err).toBeInstanceOf(Error);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err.message).toBe(dummyErrorMessage);
      }
    });
  });
});
