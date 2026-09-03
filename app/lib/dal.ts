import { cache } from "react";
import { redirect } from "next/navigation";
import { readSession } from "@/app/lib/session";
import { findUserById, type StoredUser } from "@/app/lib/store";

/** Public-safe view of a user (never exposes the password hash). */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    createdAt: user.createdAt,
  };
}

/** Returns the current user or null. Memoized per render pass. */
export const getCurrentUser = cache(async (): Promise<PublicUser | null> => {
  const session = await readSession();
  if (!session) return null;
  const user = await findUserById(session.userId);
  return user ? toPublicUser(user) : null;
});

/**
 * Enforces authentication. Redirects to /login (optionally preserving a
 * return path) when there is no valid session.
 */
export async function requireUser(redirectTo?: string): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo ? `/login?next=${encodeURIComponent(redirectTo)}` : "/login");
  }
  return user;
}
