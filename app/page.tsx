"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Search, Star, ArrowRight,
  ShieldCheck, Sparkles,
  Wind, Zap, Hammer, Brush, Tv, Smartphone,
  ChevronRight, Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function LobbyPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: 'AC', icon: <Wind size={20} />, color: 'bg-blue-50 text-blue-600' },
    { name: 'Listrik', icon: <Zap size={20} />, color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Tukang', icon: <Hammer size={20} />, color: 'bg-orange-50 text-orange-600' },
    { name: 'Bersih', icon: <Brush size={20} />, color: 'bg-green-50 text-green-600' },
    { name: 'TV', icon: <Tv size={20} />, color: 'bg-purple-50 text-purple-600' },
    { name: 'HP', icon: <Smartphone size={20} />, color: 'bg-rose-50 text-rose-600' },
  ];

  useEffect(() => {
    fetchProviders();
  }, []);

  async function fetchProviders() {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select(`
          *,
          reviews (rating)
        `)
        .limit(6)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map((p: any) => {
        const total = p.reviews?.reduce((acc: number, r: any) => acc + r.rating, 0) || 0;
        const avg = p.reviews?.length ? (total / p.reviews.length).toFixed(1) : "0.0";
        return { ...p, avgRating: avg, totalReviews: p.reviews?.length || 0 };
      });

      setProviders(formattedData);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 pb-10 font-poppins">
      {/* HERO SECTION - KEMBALI KE DESAIN ASLI ANDA */}
      <header className="bg-white pt-10 md:pt-16 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-blue-50 rounded-full blur-[80px] md:blur-[120px] -mr-32 -mt-20 opacity-60"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8">
            <Sparkles size={12} className="text-blue-400" /> Solusi Jasa Terpercaya
          </div>

          <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 italic leading-[1.1] md:leading-[0.9]">
            Panggil Ahli, <br className="hidden md:block" /> <span className="text-blue-600">Terima Beres.</span>
          </h1>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group mb-10 md:mb-12">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Cari servis AC, listrik..."
              className="w-full bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] pl-14 pr-6 py-5 md:py-7 shadow-xl shadow-slate-200/60 outline-none focus:border-blue-600 transition-all text-sm md:text-lg font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* Quick Categories */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 md:gap-8 max-w-3xl mx-auto">
            {categories.map((cat) => (
              <Link
                href={`/search?q=${cat.name}`}
                key={cat.name}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] ${cat.color} flex items-center justify-center shadow-sm group-hover:-translate-y-2 transition-all duration-300 border border-transparent`}>
                  {cat.icon}
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* CARA KERJA SECTION - LEBIH PRO DENGAN CARD MODERN */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-20 text-white flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight">Gak Pakai Ribet, <br className="hidden md:block" /> Langsung Beres.</h2>
            <p className="text-sm md:text-lg text-slate-400 font-medium leading-relaxed">Hubungi mitra ahli kami langsung melalui WhatsApp tanpa birokrasi ribet.</p>
          </div>
          <div className="md:w-1/2 flex flex-col gap-5 w-full">
            {[
              { t: 'Pilih Jasa Terbaik', d: 'Cari berdasarkan kategori dan spesialisasi.' },
              { t: 'Cek Portofolio Kerja', d: 'Lihat hasil kerja nyata dari proyek sebelumnya.' },
              { t: 'Langsung Chat WhatsApp', d: 'Diskusi jadwal dan harga tanpa perantara.' }
            ].map((step, i) => (
              <div key={i} className="flex gap-5 items-center p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="text-blue-500 font-black italic text-2xl group-hover:scale-110 transition-transform">0{i + 1}</div>
                <div>
                  <h4 className="font-black text-sm md:text-base uppercase italic tracking-tight">{step.t}</h4>
                  <p className="text-[10px] md:text-xs text-slate-400 font-medium">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REKOMENDASI MITRA - REDESIGN CARD LEBIH PREMIUM */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2 italic">Exclusive Partners</h2>
            <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">Rekomendasi Ahli</h3>
          </div>
          <Link href="/search" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            Semua <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((provider) => (
              <Link
                href={`/profile/${provider.user_id}`}
                key={provider.id}
                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-slate-50 overflow-hidden border-2 border-slate-50 shadow-inner">
                    {provider.avatar_url ? (
                      <img src={provider.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200 font-black text-3xl italic uppercase">{provider.name?.substring(0, 1)}</div>
                    )}
                  </div>
                  <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 italic group-hover:text-blue-600 transition-colors line-clamp-1 uppercase tracking-tighter">
                    {provider.name}
                  </h3>
                  <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                    {provider.category || 'Profesional'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-black text-slate-900">{provider.avgRating}</span>
                    <span className="text-[10px] text-slate-400 font-bold">({provider.totalReviews})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-all">
                    Detail <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}