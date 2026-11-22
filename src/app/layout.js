import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'PizzaHub — Pizza Ordering & Delivery Platform',
  description: 'Hot & fresh artisan pizzas from award-winning local pizzerias delivered right to your door.',
  keywords: 'pizza, delivery, restaurant, food ordering, artisan pizza, gourmet pizza',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
