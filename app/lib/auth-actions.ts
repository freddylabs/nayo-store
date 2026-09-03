"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSession, deleteSession } from "@/app/lib/session";
import { requireUser } from "@/app/lib/dal";
import {
  createUser,
  findUserByEmail,
  updateUser,
  verifyPassword,
} from "@/app/lib/store";

export interface AuthFormState {
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    form?: string;
  };
  values?: {
    name?: string;
    email?: string;
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeNext(next: FormDataEntryValue | null): string {
  const value = typeof next === "string" ? next : "";
  // Only allow same-site relative paths to avoid open-redirects.
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return "/dashboard";
}

export async function signup(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const errors: NonNullable<AuthFormState["errors"]> = {};
  if (name.length < 2) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (password.length < 8)
    errors.password = "Password must be at least 8 characters long.";

  if (Object.keys(errors).length > 0) {
    return { errors, values: { name, email } };
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return {
      errors: { email: "An account with this email already exists." },
      values: { name, email },
    };
  }

  const user = await createUser({ name, email, password });
  await createSession(user.id);
  revalidatePath("/", "layout");
  redirect(next);
}

export async function login(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const errors: NonNullable<AuthFormState["errors"]> = {};
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (!password) errors.password = "Please enter your password.";

  if (Object.keys(errors).length > 0) {
    return { errors, values: { email } };
  }

  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return {
      errors: { form: "Incorrect email or password." },
      values: { email },
    };
  }

  await createSession(user.id);
  revalidatePath("/", "layout");
  redirect(next);
}

export async function logout(): Promise<void> {
  await deleteSession();
  revalidatePath("/", "layout");
  redirect("/");
}

export interface ProfileFormState {
  ok?: boolean;
  error?: string;
}

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await requireUser("/dashboard/settings");

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (name.length < 2) {
    return { error: "Please enter your full name." };
  }

  await updateUser(user.id, { name, phone, address });
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
