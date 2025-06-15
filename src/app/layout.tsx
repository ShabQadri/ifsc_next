import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "IFSC Code Lookup",
  description: "Find Indian Financial System Codes for banks across India.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="main-container">{children}</div>
      </body>
    </html>
  );
}