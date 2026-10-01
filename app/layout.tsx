import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escudo PyME | Protección clara para tu negocio",
  description: "Acciones sencillas para reducir riesgos y cuidar la continuidad de tu negocio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
