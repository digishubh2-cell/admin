import { LogoLibrary } from "@/components/admin/logo-marquee/LogoLibrary";
export default function LogoLibraryPage() {
  const siteOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? "https://www.shubhdigi.in" : "http://localhost:3000")).origin;
  return <LogoLibrary siteOrigin={siteOrigin} />;
}
