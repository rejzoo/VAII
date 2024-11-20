import Menu from './components/Menu';
import Header from './components/Header';
import Footer from './components/Footer'
import "./styles/global.css"

export const metadata = {
  title: 'Seal Clubber',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen flex">
        {/*
        <div className="w-60 bg-gray-800 text-white">
          <Menu />
        </div>
        */}
        <Menu />
        <div className="flex-1 flex flex-col bg-gray-600">
          <header className="bg-gray-800 text-white p-4">
            <Header />
          </header>

          <main className="flex-1 p-5">
            {children}
          </main>

          <footer className="bg-gray-800 text-white p-4">
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
