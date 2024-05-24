import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';

interface ClientMessage {
  action: string;
  payload?: any;
}

const initializeWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  const rooms: { [key: string]: WebSocket[] } = {};

  wss.on('connection', (ws: WebSocket, req) => {
    const urlParts = req.url?.split('/');
    const albumId = urlParts && urlParts[2];

    if (albumId) {
      if (!rooms[albumId]) {
        rooms[albumId] = [];
      }
      rooms[albumId].push(ws);

      ws.on('message', (message: string) => {
        const { action, payload }: ClientMessage = JSON.parse(message);

        rooms[albumId].forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action, payload }));
          }
        });
      });

      ws.on('close', () => {
        rooms[albumId] = rooms[albumId].filter(client => client !== ws);
      });
    }
  });
};

export default initializeWebSocketServer;
