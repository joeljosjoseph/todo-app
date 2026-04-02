import "./globals.css";

export const metadata = {
  title: "Prooflist",
  description: "A simple to-do app proof of concept built with Next.js.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
