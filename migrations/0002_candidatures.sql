CREATE TABLE IF NOT EXISTS candidatures (
  id TEXT PRIMARY KEY,
  mailbox TEXT NOT NULL,
  folder TEXT NOT NULL,
  uidvalidity TEXT NOT NULL,
  uid TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  received_at TEXT NOT NULL,
  message_id TEXT NOT NULL DEFAULT '',
  response_subject TEXT NOT NULL,
  response_text TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'uncertain')),
  send_token TEXT,
  sent_at TEXT,
  imported_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (mailbox, folder, uidvalidity, uid)
);
CREATE INDEX IF NOT EXISTS candidatures_received ON candidatures(received_at DESC);
