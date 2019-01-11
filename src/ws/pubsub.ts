import EventEmitter from 'events';

class PubSub extends EventEmitter {}
const pubsub = new PubSub();
export default pubsub;

export function publish(cmd: string, data: any): void {
  pubsub.emit(cmd, data);
}

export function once(cmd: string): Promise<any> {
  return new Promise(resolve => {
    pubsub.once(cmd, data => resolve(data));
  });
}
