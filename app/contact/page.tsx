import ContactContent from "./ContactContent";
import { getCopy } from "@/app/lib/store";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  return <ContactContent copy={await getCopy()} />;
}
