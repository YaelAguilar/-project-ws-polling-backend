import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import albumRoutes from './routes/albumRoutes';
import config from './config';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { CustomWebSocket } from './types/customWebSocket';
import Album from './models/album';

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/albums', albumRoutes);

connectDB().then(() => {
  server.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
  });
});

const wss = new WebSocketServer({ server });

const rooms: { [key: string]: CustomWebSocket[] } = {};

wss.on('connection', (ws: CustomWebSocket) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    console.log('Message received:', data);

    if (data.type === 'join') {
      const { room } = data.payload;
      ws.roomId = room;
      if (!rooms[room]) {
        rooms[room] = [];
      }
      rooms[room].push(ws);
      sendInitialTrack(ws, room);
    } else if (data.type === 'control') {
      handleControl(ws, data.payload);
    }
  });

  ws.on('close', () => {
    if (ws.roomId) {
      console.log(`Client disconnected from room ${ws.roomId}`);
      rooms[ws.roomId] = rooms[ws.roomId].filter(client => client !== ws);
      if (rooms[ws.roomId].length === 0) {
        delete rooms[ws.roomId];
      }
    }
  });
});

async function sendInitialTrack(ws: CustomWebSocket, room: string) {
  const album = await getAlbumById(room);
  if (album && album.songs.length > 0) {
    ws.send(JSON.stringify({ type: 'track', url: album.songs[0].url }));
  }
}

function handleControl(ws: CustomWebSocket, payload: { room: string; action: string; time?: number; volume?: number }) {
  const room = payload.room;
  if (!rooms[room]) return;

  rooms[room].forEach(client => {
    if (client !== ws) {
      client.send(JSON.stringify({ type: 'control', action: payload.action, time: payload.time, volume: payload.volume }));
    }
  });

  if (payload.action === 'seek' && typeof payload.time !== 'undefined') {
    rooms[room].forEach(client => {
      if (client !== ws) {
        client.send(JSON.stringify({ type: 'seek', time: payload.time }));
      }
    });
  }
}

async function getAlbumById(id: string) {
  try {
    const album = await Album.findById(id).exec();
    return album;
  } catch (error) {
    console.error('Error fetching album:', error);
    return null;
  }
}
