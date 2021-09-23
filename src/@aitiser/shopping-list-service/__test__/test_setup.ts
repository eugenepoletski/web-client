import { createServer } from 'http';
import { Server } from 'socket.io';

export const httpServer = createServer();
export const io = new Server(httpServer);

beforeAll((done) => {
  httpServer.listen(() => {
    done();
  });
});

afterAll(() => {
  io.close();
});
