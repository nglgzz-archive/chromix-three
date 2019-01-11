import { chrome } from '../../chrome';

export type TabInfo = {
  active: boolean;
  audible: boolean;
  autoDiscardable: boolean;
  discarded: boolean;
  favIconUrl: string;
  height: number;
  highlighted: boolean;
  id: number;
  incognito: boolean;
  index: number;
  mutedInfo: { muted: boolean };
  pinned: boolean;
  selected: boolean;
  status: string;
  title: string;
  url: string;
  width: number;
  windowId: number;
};

export default class Tab {
  info: TabInfo;

  constructor(info: TabInfo) {
    this.info = info;
  }

  setPosition = async (index: number): Promise<Tab> => {
    this.info = await chrome('tabs.move', this.info.id, { index });
    return this;
  };

  close = (): Promise<undefined> => {
    return chrome('tabs.remove', this.info.id);
  };

  pin = async (pinned?: boolean): Promise<Tab> => {
    this.info = await chrome('tabs.update', this.info.id, {
      pinned: pinned === undefined ? true : pinned,
    });
    return this;
  };

  executeScript = async (
    script: string,
    withContext?: boolean,
    returnOutput?: boolean,
  ): Promise<Tab | any> => {
    let code = script;
    if (withContext) {
      // execute the script in the context of the tab
      code = `
      {
        const script = document.createElement('script');
        const code = document.createTextNode(\`(function() {${code}})();\`);
        script.appendChild(code);
        document.body.appendChild(script);
        document.body.removeChild(script);
      }
    `;
    }

    const output = await chrome('tabs.executeScript', this.info.id, {
      code,
      runAt: 'document_end',
    });
    return returnOutput ? output : this;
  };

  setURL = async (url: string): Promise<Tab> => {
    this.info = await chrome('tabs.update', this.info.id, { url });
    return this;
  };
  reload = async (bypassCache?: boolean): Promise<Tab> => {
    await chrome('tabs.reload', this.info.id, { bypassCache });
    return this;
  };
  goBack = async (): Promise<Tab> => {
    // This is available only in the current Beta channel.
    // await chrome('tabs.goBack', this.info.id);
    await this.executeScript('history.back()');
    return this;
  };
  goForward = async (): Promise<Tab> => {
    // This is available only in the current Beta channel.
    // await chrome('tabs.goForward', this.info.id);
    await this.executeScript('history.forward()');
    return this;
  };

  toString = (): string => {
    const { id, url, title } = this.info;
    return `${id} ${url} ${title}`;
  };
}
