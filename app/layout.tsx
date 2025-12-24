import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import { Toaster } from 'sonner'; // Tambahkan ini untuk notifikasi estetik

const inter = Inter({ subsets: ["latin"] });

// --- SEO & METADATA OPTIMIZED FOR SURAKARTA ---
export const metadata: Metadata = {
  title: {
    default: "PintarLokal Surakarta | Hubungkan Jasa Profesional Solo",
    template: "%s | PintarLokal Surakarta"
  },
  description: "Cari jasa servis AC, listrik, bangunan, dan kebersihan terbaik di Surakarta. Platform penghubung warga Solo dengan mitra ahli lokal yang transparan dan terpercaya.",
  keywords: [
    "Jasa Solo",
    "Servis AC Surakarta",
    "Tukang Bangunan Solo",
    "PintarLokal Surakarta",
    "Jasa Panggilan Solo Raya",
    "Layanan Kebersihan Surakarta"
  ],
  authors: [{ name: "PintarLokal Team" }],
  creator: "PintarLokal Surakarta",
  publisher: "PintarLokal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Open Graph untuk tampilan saat link dibagikan di WA/IG/FB
  openGraph: {
    title: "PintarLokal Surakarta | Panggil Ahli, Terima Beres",
    description: "Platform nomor satu untuk mencari tenaga ahli profesional di area Solo Raya.",
    url: 'https://pintarlokal-solo.com', // Ganti dengan domain Anda nanti
    siteName: 'PintarLokal Surakarta',
    locale: 'id_ID',
    type: 'website',
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'PintarLokal Surakarta',
    description: 'Solusi jasa profesional untuk warga Solo Raya.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-[#FBFBFC] text-slate-900 antialiased`}>
        {/* Notifikasi Toast - Muncul di tengah atas */}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: { borderRadius: '1.2rem', padding: '16px' },
          }}
        />

        <Navbar />

        {/* Main Content: 
          - min-h-screen memastikan halaman selalu setinggi layar.
          - pt-24 memastikan konten tidak tertutup Navbar Fixed.
        */}
        <main className="min-h-screen pt-20 md:pt-24">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}