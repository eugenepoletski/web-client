import { createServer } from 'http';
import { Server } from 'socket.io';
import faker from 'faker';
import { AddressInfo } from 'net';
import { Service } from './ShoppingListService';

describe('ShoppingListService', () => {
  let io: any;
  let serverSocket: any;
  let service: any;
  let baseUrl: string;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(async () => {
      const { port } = httpServer.address() as AddressInfo;
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  beforeEach(async () => {
    service = new Service({ baseUrl });
    io.on('connection', (socket: any) => {
      serverSocket = socket;
    });
    await service.start();
  });

  afterEach(async () => {
    await service.stop();
  });

  afterAll(() => {
    io.close();
  });

  describe('Items management', () => {
    describe('Create an item', () => {
      it('should create an item', async () => {
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
    });
  });
});
