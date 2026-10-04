import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as {
  nayoSql?: Sql;
  nayoSchema?: Promise<void>;
};

export function databaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

export function hasDatabase(): boolean {
  return Boolean(databaseUrl());
}

function client(): Sql {
  if (!globalForDb.nayoSql) {
    const url = databaseUrl();
    if (!url) throw new Error("DATABASE_URL is not set.");
    globalForDb.nayoSql = postgres(url, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      // Pooled URLs (Neon, Supabase, PgBouncer) reject prepared statements.
      prepare: false,
    });
  }
  return globalForDb.nayoSql;
}

async function createSchema(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id              text PRIMARY KEY,
      order_number    text NOT NULL UNIQUE,
      created_at      timestamptz NOT NULL DEFAULT now(),
      updated_at      timestamptz,
      customer_name   text NOT NULL,
      email           text NOT NULL,
      phone           text NOT NULL DEFAULT '',
      fulfillment     text NOT NULL,
      address         jsonb,
      items           jsonb NOT NULL,
      subtotal        numeric(10, 2) NOT NULL,
      delivery_fee    numeric(10, 2) NOT NULL,
      total           numeric(10, 2) NOT NULL,
      status          text NOT NULL DEFAULT 'to_send',
      payment_status  text NOT NULL DEFAULT 'pending',
      paid_at         timestamptz,
      receipt_sent_at timestamptz,
      tracking_number text,
      label_note      text
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (lower(email))`;
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key        text PRIMARY KEY,
      value      jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS login_attempts (
      key          text PRIMARY KEY,
      failures     integer NOT NULL DEFAULT 0,
      window_start timestamptz NOT NULL DEFAULT now(),
      locked_until timestamptz
    )
  `;
}

export async function db(): Promise<Sql> {
  const sql = client();
  if (!globalForDb.nayoSchema) {
    globalForDb.nayoSchema = createSchema(sql).catch((error) => {
      globalForDb.nayoSchema = undefined;
      throw error;
    });
  }
  await globalForDb.nayoSchema;
  return sql;
}
