"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Daftarkan email ke sistem autentikasi
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        // 2. Jika berhasil, buatkan profil di tabel providers
        if (data.user) {
            const { error: dbError } = await supabase
                .from('providers')
                .insert([
                    {
                        user_id: data.user.id,
                        email: email,
                        name: name,
                        category: 'Jasa Umum',
                        city: 'Surakarta' // Default lokasi sesuai permintaan Anda
                    }
                ]);

            if (dbError) {
                alert("Gagal membuat profil: " + dbError.message);
            } else {
                alert("Registrasi Berhasil! Silakan cek email atau langsung login.");
                router.push('/login');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 md:p-6">
            <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">

                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-inner">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic">
                        Gabung <span className="text-blue-600">Mitra</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">
                        Mulai tawarkan jasa Anda untuk warga Surakarta & sekitarnya.
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="flex flex-col gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Bisnis / Tukang</label>
                        <input
                            type="text"
                            placeholder="Contoh: Solo AC Terpercaya"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm"
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Aktif</label>
                        <input
                            type="email"
                            placeholder="nama@bisnis.com"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm"
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="Min. 6 Karakter"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm"
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 mt-4 hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-70 text-xs uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Daftar Sekarang"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400 font-medium mb-4 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} className="text-green-500" /> Data Anda tersimpan dengan aman
                    </p>
                    <Link href="/login" className="text-sm font-bold text-blue-600 hover:underline underline-offset-4 transition">
                        Sudah punya akun? Masuk
                    </Link>
                </div>
            </div>
        </div>
    );
}