import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Briefly — Client Brief Intake",
  description: "Tell us about your project. We'll turn it into a clear, actionable brief.",
  openGraph: {
    title: "Briefly — Client Brief Intake",
    description: "Tell us about your project. We'll turn it into a clear, actionable brief.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
