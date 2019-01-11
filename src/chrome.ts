import { getSocket } from './ws/server';
import { once } from './ws/pubsub';

export function run(
  cmd: string,
  hasCallback: boolean,
  ...args: any
): Promise<any | any[]> {
  return new Promise(resolve => {
    const payload = JSON.stringify({
      cmd,
      args,
      hasCallback,
    });

    // Send command to client, and wait for the response to that command
    // to be published.
    getSocket().send(payload, () => {
      once(payload).then(data => resolve(data));
    });
  });
}

export function chrome(cmd: string, ...args: any): Promise<any | any[]> {
  return run(`chrome.${cmd}`, true, ...args);
}
