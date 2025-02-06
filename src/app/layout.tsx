import Menu from './components/Menu';
import Header from './components/Header';
import Footer from './components/Footer';
import "./styles/global.css";
import { AuthProvider } from '@/context/AuthContext';

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
      <body className="min-h-screen flex">
        <AuthProvider>
          <Menu />
          <div className="flex-1 flex flex-col bg-gradient-to-r from-indigo-600 to-purple-600">
            <header>
              <Header />
            </header>
            <main className="flex-1 p-5 text-white bg-[#1a1a2e] rounded-[40px] shadow-lg mr-2 ml-2">
              {children}
            </main>
            <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white pt-4 pb-4 border-purple-400">
              <Footer />
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
