import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio — Portal Kelurahan Sidoharjo",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
