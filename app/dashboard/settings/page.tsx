import { requireUser } from "@/app/lib/dal";
import SettingsForm from "@/app/dashboard/settings/SettingsForm";

export default async function SettingsPage() {
  const user = await requireUser("/dashboard/settings");

  return (
    <div className="space-y-8">
      <header>
        <p className="text-nayo-gold/70 text-xs tracking-[0.25em] uppercase mb-2">
          Dashboard
        </p>
        <h1 className="text-display text-3xl sm:text-4xl font-bold text-nayo-white">
          Account <span className="gold-text italic">Settings</span>
        </h1>
      </header>

      <SettingsForm
        name={user.name}
        email={user.email}
        phone={user.phone ?? ""}
        address={user.address ?? ""}
      />
    </div>
  );
}
