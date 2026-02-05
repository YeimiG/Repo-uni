/* layout principal */
import "../styles/globals.css";
import "../styles/medical.css";
import { Metadata } from "next";

// metadata ieproes
export const metadata: Metadata = {
  title: "IEPROES - Sistema Gestión Académica",
  description: "Panel administrativo para gestión académica IEPROES",
  keywords: "IEPROES, educación, gestión académica, estudiantes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans" suppressHydrationWarning>
        {/* contenedor principal */}
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
