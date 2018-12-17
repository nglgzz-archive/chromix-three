// Might add types for chromix-too later, but in any case
// they're not super important.
// @ts-ignore
import ChromixToo from 'chromix-too';

const chromix = ChromixToo().chromix;

export function run(cmd: string, ...args: any): Promise<any | any[]> {
  return new Promise(resolve => chromix(cmd, {}, ...args, resolve));
}

export function chrome(cmd: string, ...args: any): Promise<any | any[]> {
  return run(`chrome.${cmd}`, ...args);
}
