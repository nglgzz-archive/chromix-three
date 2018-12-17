import { chrome } from './chrome';

export type Tab = {
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

export type TabFilter = {
  pinned?: boolean;
};

export type TabMatch = {
  url?: RegExp;
  title?: RegExp;
};

// Window
export async function filter(
  filter?: TabFilter,
  match?: TabMatch,
): Promise<Tab[]> {
  const tabs = await chrome('tabs.query', filter || {});

  if (!tabs || !Array.isArray(tabs)) {
    // no results found
    return [];
  }

  if (!match) {
    // no additional filtering is needed
    return tabs;
  }

  const { url, title } = match;
  return tabs.filter(
    // both url and title must match if specified
    tab => !((url && !url.test(tab.url)) || (title && !title.test(tab.title))),
  );
}

// Tab
export function setPosition(tabID: number, index: number): Promise<Tab> {
  return chrome('tabs.move', tabID, { index });
}

export function close(tabID: number | number[]): Promise<undefined> {
  return chrome('tabs.remove', tabID);
}

export function pin(tabID: number, pinned?: boolean): Promise<Tab> {
  // if pinned is not specified it will pin the tab
  return chrome('tabs.update', tabID, {
    pinned: pinned === undefined ? true : pinned,
  });
}

export async function executeScript(
  tabID: number,
  script: string,
  withContext?: boolean,
): Promise<any> {
  let code = script;
  if (withContext) {
    // execute the script in the context of the tab
    code = `
      {
        const script = document.createElement('script');
        const code = document.createTextNode('(function() {${code}})();');
        script.appendChild(code);
        document.body.appendChild(script);
        document.body.removeChild(script);
      }
    `;
  }

  return (await chrome('tabs.executeScript', tabID, {
    code,
    runAt: 'document_end',
  }))[0];
}

// History
export function setURL(tabID: number, url: string): Promise<Tab> {
  return chrome('tabs.update', tabID, { url });
}

export function reload(
  tabID: number,
  bypassCache?: boolean,
): Promise<undefined> {
  return chrome('tabs.reload', tabID, { bypassCache });
}

export function goBack(tabID: number): Promise<undefined> {
  return chrome('tabs.goBack', tabID);
}
export function goForward(tabID: number): Promise<undefined> {
  return chrome('tabs.goForward', tabID);
}

// Util
export function toString(tab: Tab): string {
  return `${tab.id}  ${tab.url}  ${tab.title}`;
}
