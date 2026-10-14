CREATE TABLE IF NOT EXISTS enquiries (
 id uuid PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL, phone text NOT NULL, service_id text NOT NULL,
 event_date date NOT NULL, event_location text NOT NULL, package_id text,
 status text NOT NULL DEFAULT 'new', notice_version text NOT NULL,
 content_version text NOT NULL DEFAULT 'brief-v1'
);
CREATE TABLE IF NOT EXISTS creator_applications (
 id uuid PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL, phone text NOT NULL, email text NOT NULL, gender text NOT NULL,
 portfolio_url text, device_model_id text NOT NULL, locality text NOT NULL,
 status text NOT NULL DEFAULT 'submitted', notice_version text NOT NULL,
 content_version text NOT NULL DEFAULT 'brief-v1'
);
CREATE TABLE IF NOT EXISTS upload_sessions (
 id uuid PRIMARY KEY, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS uploads (
 id uuid PRIMARY KEY, session_id uuid NOT NULL REFERENCES upload_sessions(id),
 application_id uuid REFERENCES creator_applications(id), kind text NOT NULL CHECK (kind IN ('video','photo')),
 filename text NOT NULL, object_key text NOT NULL UNIQUE, declared_mime text NOT NULL,
 inspected_mime text, byte_size integer NOT NULL CHECK (byte_size > 0),
 state text NOT NULL CHECK (state IN ('authorized','uploading','uploaded','inspecting','ready','rejected','attached','deleting','expired')),
 error text, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS uploads_session_idx ON uploads(session_id);
CREATE TABLE IF NOT EXISTS idempotency (
 scope text NOT NULL, key text NOT NULL, request_hash text NOT NULL, resource_id uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(scope,key)
);
CREATE TABLE IF NOT EXISTS outbox (
 id uuid PRIMARY KEY, entity_type text NOT NULL, entity_id uuid NOT NULL,
 state text NOT NULL DEFAULT 'pending', attempts integer NOT NULL DEFAULT 0,
 next_attempt_at timestamptz NOT NULL DEFAULT now(), last_error text,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(entity_type,entity_id)
);
CREATE TABLE IF NOT EXISTS rate_limits (
 bucket text PRIMARY KEY, hits integer NOT NULL DEFAULT 1, reset_at timestamptz NOT NULL
);
