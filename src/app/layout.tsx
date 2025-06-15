import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IFSC Code Lookup',
  description: 'Find Indian Financial System Codes for banks across India. Search by bank, state, district, branch, or IFSC code.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="site-bg">
          <main className="main-container">
            {children}
          </main>
        </div>
        <footer className="footer">
          &copy; {new Date().getFullYear()} IFSC Lookup &mdash; Powered by Next.js &amp; Vercel
        </footer>
      </body>
    </html>
  );
}