import type { Metadata } from "next";
import { AdminProviders } from "@/components/admin/providers/AdminProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | ShubhDigi Admin",
  },
  robots: { index: false, follow: false },
};

/** Admin is always dynamic — do not burn Hobby ISR Writes. */
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full font-sans">
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
