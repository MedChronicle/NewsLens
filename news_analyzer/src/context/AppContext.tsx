import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface ReadHistoryItem {
  id: string;
  headline: string;
  source: string;
  category: string;
  thumbnail: string;
  readAt: string;
}

interface AppContextType {
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  apiStatus: "unconfigured" | "valid" | "invalid" | "checking";
  setApiStatus: (s: AppContextType["apiStatus"]) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  readingHistory: ReadHistoryItem[];
  addToHistory: (item: ReadHistoryItem) => void;
  clearHistory: () => void;
  rssEnabled: boolean;
  setRssEnabled: (v: boolean) => void;
  enabledFeedNames: string[];
  setEnabledFeedNames: (names: string[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function persist<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}
function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}

const DEFAULT_FEEDS = ["BBC News", "BBC Technology", "NDTV", "The Guardian", "TechCrunch", "Al Jazeera"];

export function AppProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(() => load("newslens-bookmarks", []));
  // Live-data status is now reported by the /api/news serverless function
  // (see src/pages/Feed.tsx), which is the only place that talks to NewsAPI.
  const [apiStatus, setApiStatus] = useState<AppContextType["apiStatus"]>("checking");
  const [darkMode, setDarkMode] = useState<boolean>(() => load("newslens-dark", true));
  const [readingHistory, setReadingHistory] = useState<ReadHistoryItem[]>(() => load("newslens-history", []));
  const [rssEnabled, setRssEnabledState] = useState<boolean>(() => load("newslens-rss", true));
  const [enabledFeedNames, setEnabledFeedNamesState] = useState<string[]>(() => load("newslens-feeds", DEFAULT_FEEDS));

  useEffect(() => { persist("newslens-bookmarks", bookmarks); }, [bookmarks]);
  useEffect(() => { persist("newslens-history", readingHistory.slice(0, 50)); }, [readingHistory]);
  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
    persist("newslens-dark", darkMode);
  }, [darkMode]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  }, []);
  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);
  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);
  const addToHistory = useCallback((item: ReadHistoryItem) => {
    setReadingHistory((prev) => [item, ...prev.filter((h) => h.id !== item.id)].slice(0, 50));
  }, []);
  const clearHistory = useCallback(() => setReadingHistory([]), []);
  const setRssEnabled = useCallback((v: boolean) => { setRssEnabledState(v); persist("newslens-rss", v); }, []);
  const setEnabledFeedNames = useCallback((names: string[]) => { setEnabledFeedNamesState(names); persist("newslens-feeds", names); }, []);

  return (
    <AppContext.Provider value={{
      bookmarks, toggleBookmark, isBookmarked,
      apiStatus, setApiStatus,
      darkMode, toggleDarkMode,
      readingHistory, addToHistory, clearHistory,
      rssEnabled, setRssEnabled,
      enabledFeedNames, setEnabledFeedNames,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
