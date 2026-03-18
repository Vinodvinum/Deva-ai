import "./globals.css";

export const metadata = {
  title: "Deva AI",
  description: "Ancient Wisdom · Modern Intelligence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
