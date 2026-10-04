export const OUTLOOK_URL = "https://outlook.office.com/mail/";

export type InboxMessage = {
  id: string;
  subject: string;
  from: string;
  receivedAt: string;
  url: string;
};

export type InboxSummary =
  | { configured: false }
  | { configured: true; unread: number; messages: InboxMessage[] }
  | { configured: true; error: string };

let cachedToken: { value: string; expiresAt: number } | null = null;

function settings() {
  const tenant = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const mailbox = process.env.MS_MAILBOX || process.env.ADMIN_EMAIL || "info@nayo.market";
  if (!tenant || !clientId || !clientSecret) return null;
  return { tenant, clientId, clientSecret, mailbox };
}

async function accessToken(config: NonNullable<ReturnType<typeof settings>>): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(config.tenant)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    }
  );
  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description?.split("\r\n")[0] || `Microsoft sign in failed (${res.status})`);
  }
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return data.access_token;
}

/** Unread count and latest unread emails in the shop inbox, via Microsoft Graph. */
export async function getInboxSummary(): Promise<InboxSummary> {
  const config = settings();
  if (!config) return { configured: false };

  try {
    const token = await accessToken(config);
    const mailbox = encodeURIComponent(config.mailbox);
    const headers = { Authorization: `Bearer ${token}` };
    const [folderRes, listRes] = await Promise.all([
      fetch(
        `https://graph.microsoft.com/v1.0/users/${mailbox}/mailFolders/inbox?$select=unreadItemCount`,
        { headers, cache: "no-store" }
      ),
      fetch(
        `https://graph.microsoft.com/v1.0/users/${mailbox}/mailFolders/inbox/messages?$filter=isRead eq false&$top=6&$select=id,subject,from,receivedDateTime,webLink`,
        { headers, cache: "no-store" }
      ),
    ]);
    if (!folderRes.ok || !listRes.ok) {
      const failed = !folderRes.ok ? folderRes : listRes;
      const body = (await failed.json().catch(() => ({}))) as { error?: { message?: string } };
      throw new Error(body.error?.message || `Microsoft Graph returned ${failed.status}`);
    }
    const folder = (await folderRes.json()) as { unreadItemCount?: number };
    const list = (await listRes.json()) as {
      value?: {
        id: string;
        subject?: string;
        from?: { emailAddress?: { name?: string; address?: string } };
        receivedDateTime?: string;
        webLink?: string;
      }[];
    };
    const messages = (list.value ?? [])
      .map((m) => ({
        id: m.id,
        subject: m.subject || "(no subject)",
        from: m.from?.emailAddress?.name || m.from?.emailAddress?.address || "Unknown sender",
        receivedAt: m.receivedDateTime ?? "",
        url: m.webLink || OUTLOOK_URL,
      }))
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
    return { configured: true, unread: folder.unreadItemCount ?? messages.length, messages };
  } catch (error) {
    console.error("[outlook] inbox check failed", error);
    return {
      configured: true,
      error: error instanceof Error ? error.message : "Could not reach Microsoft 365.",
    };
  }
}
