/** Safe wrappers around browser storage. Phase 1 uses the browser as a stand-in database. */
export const readJson = <T,>(key: string, fallback: T, store: Storage = localStorage): T => {
  try {
    const raw = store.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const writeJson = (key: string, value: unknown, store: Storage = localStorage) => {
  try {
    store.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable: ignore in the prototype */
  }
}

export const removeKey = (key: string, store: Storage = localStorage) => {
  try {
    store.removeItem(key)
  } catch {
    /* ignore */
  }
}
