import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "User Admin",
  description: "User Admin Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
          <nav>
            <a href="/users" style={{ marginRight: "1rem" }}>Users</a>
          </nav>
        </header>
        <main style={{ padding: "1rem" }}>{children}</main>
      </body>
    </html>
  );
}