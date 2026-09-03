import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/app/components/AuthForm";
import { getCurrentUser } from "@/app/lib/dal";

export const metadata: Metadata = {
  title: "Sign In — Nayo",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(next && next.startsWith("/") ? next : "/dashboard");

  return <AuthForm mode="login" next={next} />;
}
