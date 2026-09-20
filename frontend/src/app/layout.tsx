import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GasControl",
  description: "Control de despacho de una estación de servicio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}