let logging = false;
const log = (str, data) => {
  if (logging) console.log(`[Chromix] ${str}`, data || '');
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const getSocketURL = () =>
  new Promise(resolve =>
    chrome.storage.sync.get(
      { socketURL: 'ws://localhost:4000/chromix' },
      resolve,
    ),
  );

const sendResult = (cmd, response) => {
  // (cmd: string, response: any[])
  log(`Sending response:`, response);
  const payload = JSON.stringify({ cmd, data: response });
  if (ws) {
    ws.send(payload);
    log('Response sent.');
  } else {
    log('Not connected. No response sent.');
  }
};

// ws: WebSocket | null
let ws = null;
const startConnection = url => {
  ws = new WebSocket(url);
  ws.onopen = () => log('Connected.');
  ws.onclose = () => {
    log('Disconnected, trying to connect again.');
    attemptConnection(url);
  };
  ws.onmessage = ({ data }) => {
    // cmd: { cmd: string, args: any[], hasCallback: boolean }
    const cmd = JSON.parse(data);
    log('Received data:', cmd);

    // Parse command, execute it, and send back the response.
    const fn = cmd.cmd.split('.').reduce((obj, key) => obj[key], window);
    if (cmd.hasCallback) {
      fn(...cmd.args, (...result) => sendResult(data, result));
    } else {
      const response = fn(...cmd.args);
      sendResult(data, response);
    }
  };
};

const attemptConnection = async () => {
  while (!ws || ws.readyState === ws.CLOSED) {
    try {
      const { socketURL } = await getSocketURL();
      log('Connecting:', socketURL);
      startConnection(socketURL);
    } catch (error) {
      log('Connection failed, retrying.', error);
      await sleep(3000);
    }
  }
};

attemptConnection();
