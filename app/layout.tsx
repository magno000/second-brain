import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Segundo Cerebro | OpenClaw Dashboard",
  description: "Tablero centralizado donde OpenClaw publica tareas, investigaciones y resultados automáticamente.",
  keywords: ["segundo cerebro", "openclaw", "agente ia", "dashboard", "documentos"],
  openGraph: {
    title: "Segundo Cerebro | OpenClaw Dashboard",
    description: "Tablero centralizado de OpenClaw — documentos, tareas e investigaciones en tiempo real.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
