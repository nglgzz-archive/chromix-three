import { chrome } from '../chrome';
import Tab from './Tab';

export type TabFilter = {
  pinned?: boolean;
};

export type TabMatch = {
  url?: RegExp;
  title?: RegExp;
};

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
    return tabs.map(tab => new Tab(tab));
  }

  const { url, title } = match;
  return tabs
    .filter(
      // both url and title must match if specified
      tab =>
        !((url && !url.test(tab.url)) || (title && !title.test(tab.title))),
    )
    .map(tab => new Tab(tab));
}
