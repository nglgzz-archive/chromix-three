import WebSocket, { Server } from 'ws';
import { publish } from './pubsub';

function env(name: string, fallback: string): string {
  return process.env[`CHROMIX_${name}`] || fallback;
}

const host = env('HOST', 'localhost');
const port = Number(env('PORT', '4000'));
const path = env('PATH', '/chromix');
const server = new Server({ host, port, path }, () => {
  console.log(`[Chromix] Server started at ws://${host}:${port}${path}`);
});

let client: WebSocket | null = null;
server.addListener('connection', ws => {
  console.log(`[Chromix] Client connected.`);
  // Make the client socket available outside this function.
  client = ws;

  ws.onmessage = ({ data: dataBuffer }) => {
    type Response = { cmd: string; data: any };
    const { cmd, data }: Response = JSON.parse(dataBuffer.toString());

    // Publish the response (data) for a command (cmd).
    publish(cmd, data);
  };
});

export function getSocket(): WebSocket {
  if (client === null) {
    throw Error('[Chromix] Client not connected.');
  }

  return client;
}
