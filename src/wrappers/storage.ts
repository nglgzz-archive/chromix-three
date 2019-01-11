import { chrome } from '../chrome';

export function set(key: string, value: any): Promise<undefined> {
  return chrome('storage.local.set', { [key]: JSON.stringify(value) });
}

export function remove(key: string | string[]): Promise<undefined> {
  return chrome('storage.local.remove', key);
}

export function clear(): Promise<undefined> {
  return chrome('storage.local.clear');
}

export async function get(key?: string | string[]): Promise<Object> {
  const res: { [key: string]: string } = await chrome('storage.local.get', key);
  return Object.keys(res).reduce((obj, key) => {
    const value = res[key];

    if (value === null || value === undefined) {
      return { ...obj, [key]: value };
    }

    return { ...obj, [key]: JSON.parse(value) };
  }, {});
}
