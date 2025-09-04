// logger: stores structured logs in localStorage under "app:logs:v1"
const KEY = "app:logs:v1";

function readLogs() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const logger = {
  event(type, payload) {
    try {
      const entry = { ts: Date.now(), type, payload };
      const logs = readLogs();
      logs.push(entry);
      // keep last 1000 events to avoid unbounded growth
      if (logs.length > 1000) logs.shift();
      localStorage.setItem(KEY, JSON.stringify(logs));
    } catch {
      // intentionally swallow
    }
  },
  read() {
    return readLogs();
  },
  clear() {
    localStorage.removeItem(KEY);
  }
};
