import AdminDashboard from "@/app/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-nayo-green">
      <AdminDashboard />
    </main>
  );
}
