import Parser from "rss-parser";

const parser = new Parser();

export interface FetchedRSSItem {
  title: string;
  link: string;
  contentSnippet: string;
  pubDate?: string;
}

/**
 * Fetches and parses an RSS feed URL, returning a list of standardized feed items.
 */
export async function fetchRSSFeed(feedUrl: string): Promise<FetchedRSSItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.map(item => ({
      title: item.title || "No Title",
      link: item.link || "",
      contentSnippet: item.contentSnippet || item.content || "",
      pubDate: item.pubDate
    }));
  } catch (error: any) {
    console.error(`Failed to parse RSS feed from ${feedUrl}:`, error);
    return [];
  }
}
