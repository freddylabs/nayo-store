import AboutContent from "./AboutContent";
import { getCopy } from "@/app/lib/store";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  return <AboutContent copy={await getCopy()} />;
}
