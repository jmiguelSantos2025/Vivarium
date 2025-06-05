import './globals.css';

export const metadata = {
  title: 'Vivarium',
  description: 'Monitoramento ambiental',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        {/* Header e Footer podem ser incluídos aqui, se necessário */}
        {children}
      </body>
    </html>
  );
}
