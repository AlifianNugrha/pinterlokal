"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, Zap, Store, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (_event === 'SIGNED_OUT') setUser(null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
        router.refresh();
    };

    // Sembunyikan navbar jika sedang di area dashboard
    if (pathname?.startsWith('/dashboard')) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-5">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] px-6 md:px-10 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex justify-between items-center">

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-slate-900 rounded-[1.2rem] flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 shadow-lg shadow-slate-200">
                            <Zap size={18} className="text-white fill-white" />
                        </div>
                        <span className="font-black tracking-tighter text-xl italic text-slate-900 uppercase">
                            Pintar<span className="text-blue-600">Lokal</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-2">
                                {user.user_metadata?.role === 'mitra' ? (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 group"
                                    >
                                        <LayoutDashboard size={14} />
                                        <span>Panel Dashboard</span>
                                        <ArrowUpRight size={12} className="opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Link>
                                ) : (
                                    <span className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">
                                        Halo, {user.user_metadata?.full_name?.split(' ')[0]}
                                    </span>
                                )}
                                <button onClick={handleLogout} className="p-3.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="hidden md:block text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest px-6 transition-colors">Masuk</Link>
                                <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.15em] bg-slate-900 text-white px-8 py-3.5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2">
                                    <Store size={14} />
                                    <span>Jadi Mitra</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}