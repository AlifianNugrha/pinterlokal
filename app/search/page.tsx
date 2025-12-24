"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    Search, Star, ArrowRight,
    ShieldCheck, Filter, Loader2,
    Home, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Semua');

    const categories = ['Semua', 'AC', 'Listrik', 'Bangunan', 'Kebersihan', 'Elektronik'];

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                let rpc = supabase.from('providers').select('*');
                if (query) {
                    rpc = rpc.or(`name.ilike.%${query}%,category.ilike.%${query}%,bio.ilike.%${query}%`);
                }
                const { data, error } = await rpc;
                if (error) throw error;
                setResults(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    const filteredResults = activeTab === 'Semua'
        ? results
        : results.filter(p => p.category?.toLowerCase().includes(activeTab.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#FBFBFC] pb-20 pt-4 md:pt-6">
            <div className="max-w-6xl mx-auto px-4 md:px-6">

                {/* --- HEADER NAVIGASI --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2.5 md:p-3 bg-white border border-slate-100 rounded-xl md:rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm"
                        >
                            {/* Perbaikan: Menggunakan className untuk responsivitas ukuran ikon */}
                            <ArrowLeft className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
                        </button>
                        <div>
                            <h1 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5 md:mb-1">
                                Eksplorasi Jasa
                            </h1>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 italic leading-tight">
                                {query ? `Hasil "${query}"` : "Semua Layanan"}
                            </h2>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="hidden md:inline-flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <Home className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        Kembali ke Beranda
                    </Link>
                </div>

                {/* --- CATEGORY PILLS --- */}
                <div className="flex gap-2.5 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === cat
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                    : 'bg-white text-slate-400 border-slate-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* --- RESULTS GRID --- */}
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
                ) : filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {filteredResults.map((provider) => (
                            <Link
                                href={`/profile/${provider.user_id}`}
                                key={provider.id}
                                className="bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-5 md:p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4 md:mb-6">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 shadow-inner">
                                        {provider.avatar_url ? (
                                            <img src={provider.avatar_url} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200 font-bold italic text-lg uppercase">
                                                {provider.name?.substring(0, 1)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-blue-50 text-blue-600 p-2 md:p-2.5 rounded-xl">
                                        <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 md:mb-2 italic group-hover:text-blue-600 transition-colors">
                                    {provider.name}
                                </h3>
                                <p className="text-[9px] md:text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4 md:mb-6">
                                    {provider.category}
                                </p>

                                <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-[11px] md:text-xs font-bold text-slate-900">4.9</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-600">
                                        Lihat Profil <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 md:py-32 bg-white rounded-[2rem] md:rounded-[3rem] border border-dashed border-slate-200 px-6">
                        <Search className="w-10 h-10 md:w-12 md:h-12 mx-auto text-slate-100 mb-4" />
                        <p className="text-xs md:text-sm text-slate-400 font-medium italic">Maaf, kami tidak menemukan mitra.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
            <SearchContent />
        </Suspense>
    );
}