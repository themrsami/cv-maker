import type { Metadata } from "next";
import "./globals.css";
import "./styles/fonts.css";
import { CVProvider } from "./context/CVContext";

export const metadata: Metadata = {
  title: "CV Maker",
  description: "Create your professional CV",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CVProvider>{children}</CVProvider>
      </body>
    </html>
  );
}
