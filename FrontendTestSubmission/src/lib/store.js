import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { logger } from "./logger";

const KEY = "app:links:v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function save(obj) {
  try {
    localStorage.setItem(KEY, JSON.stringify(obj));
  } catch {}
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function genCode(len = 6) {
  let s = "";
  for (let i = 0; i < len; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return s;
}
const CODE_RE = /^[A-Za-z0-9]{3,32}$/;

function normalizeUrl(input) {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed);
  try {
    const url = new URL(hasScheme ? trimmed : `https://${trimmed}`);
    return url.toString();
  } catch {
    return null;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [links, setLinks] = useState(() => load());

  useEffect(() => save(links), [links]);

  const api = useMemo(() => {
    return {
      links, // object keyed by code

      // create a link. returns { code } or throws Error
      create({ url, validityMins, customCode }) {
        const normalized = normalizeUrl(url);
        if (!normalized) {
          logger.event("link.create_failed", { reason: "bad_url", url });
          throw new Error("Invalid URL");
        }
        const mins = Number.isFinite(validityMins) ? Math.max(1, Math.floor(validityMins)) : 30;
        let code = customCode ? String(customCode).trim() : "";
        if (code) {
          if (!CODE_RE.test(code)) {
            logger.event("link.create_failed", { reason: "bad_code_format", code });
            throw new Error("Shortcode must be alphanumeric and 3–32 characters.");
          }
          if (links[code]) {
            logger.event("shortcode.collision", { code });
            throw new Error("Shortcode already taken.");
          }
        } else {
          // auto-generate until unique (reasonable attempts)
          let attempts = 0;
          do {
            code = genCode(6 + Math.floor(Math.random() * 3)); // 6-8 chars
            attempts++;
            if (attempts > 10 && links[code]) {
              // increase size if many collisions
              code = genCode(10);
            }
          } while (links[code]);
        }
        const now = Date.now();
        const link = {
          code,
          url: normalized,
          createdAt: now,
          expiresAt: now + mins * 60_000,
          clicks: 0,
          history: [] // { ts, referrer, geo }
        };
        setLinks(prev => ({ ...prev, [code]: link }));
        logger.event("link.created", { code, url: normalized, mins });
        return { code };
      },

      remove(code) {
        if (!links[code]) return;
        setLinks(prev => {
          const { [code]: _, ...rest } = prev;
          return rest;
        });
        logger.event("link.deleted", { code });
      },

      resolve(code) {
        const l = links[code];
        if (!l) return null;
        if (Date.now() >= l.expiresAt) return null;
        return l;
      },

      recordHit(code, meta = {}) {
        setLinks(prev => {
          const l = prev[code];
          if (!l) return prev;
          const ts = Date.now();
          const historyItem = { ts, referrer: meta.referrer || document.referrer || null, geo: meta.geo || Intl.DateTimeFormat().resolvedOptions().timeZone || null };
          const updated = { ...l, clicks: (l.clicks || 0) + 1, history: [...(l.history || []), historyItem] };
          return { ...prev, [code]: updated };
        });
        logger.event("redirect.hit", { code, meta });
      },

      readAll() {
        return Object.values(links).sort((a, b) => b.createdAt - a.createdAt);
      },

      clearAll() {
        setLinks({});
        logger.event("store.cleared");
      }
    };
  }, [links]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
