CREATE TABLE IF NOT EXISTS candidature_ignored (
  id TEXT PRIMARY KEY,
  ignored_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
