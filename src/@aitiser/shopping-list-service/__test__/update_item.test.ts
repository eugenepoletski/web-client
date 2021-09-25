import { CssBaseline } from '@material-ui/core';
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

      expect(result).toMatchObject(dummyItem);
    });

    it('rejects to apply invalid item update an reports reason', async () => {
      const dummyItemId = faker.datatype.uuid();
      const dummyInvalidItemUpdate = { title: '' };
      const dummyRejectReason = { title: faker.lorem.sentence() };
      serverSocket.on(
        'shoppingListItem:update',
        (itemId: string, itemUpdate: any, cb: any) => {
          cb({
            status: 'fail',
            payload: dummyRejectReason,
          });
        },
      );

      expect.assertions(2);

      try {
        await service.updateItem(dummyItemId, dummyInvalidItemUpdate);
      } catch (err: any) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err).toBeInstanceOf(service.ValidationError);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err.reason).toMatchObject(dummyRejectReason);
      }
    });

    it('rejects to update item and reports an error when an error occured', async () => {
      const dummyItemId = faker.datatype.uuid();
      const dummyItemUpdate = { title: faker.lorem.sentence().slice(0, 50) };
      const dummyErrorMessage = faker.lorem.sentence();
      serverSocket.on(
        'shoppingListItem:update',
        (itemId: string, itemUpdate: any, cb: any) => {
          cb({
            status: 'error',
            message: dummyErrorMessage,
          });
        },
      );

      expect.assertions(2);

      try {
        await service.updateItem(dummyItemId, dummyItemUpdate);
      } catch (err: any) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err).toBeInstanceOf(Error);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err.message).toBe(dummyErrorMessage);
      }
    });
  });
});
