"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Loader2, Store, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [userType, setUserType] = useState<'buyer' | 'mitra'>('buyer');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegistering) {
                const pendingData = { email, password, name, userType };
                sessionStorage.setItem('pending_registration', JSON.stringify(pendingData));

                if (userType === 'mitra') {
                    toast.info("Lanjutkan ke pembayaran untuk aktivasi.");
                    router.push(`/payment?name=${encodeURIComponent(name)}`);
                } else {
                    const { error } = await supabase.auth.signUp({
                        email, password, options: { data: { full_name: name, role: 'buyer' } }
                    });
                    if (error) throw error;
                    toast.success("Registrasi Berhasil!");
                    router.push('/');
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                const role = data.user?.user_metadata?.role;

                // CRITICAL: Refresh router agar Navbar & State Global terupdate
                router.refresh();

                if (role === 'mitra') {
                    router.replace('/dashboard');
                } else {
                    router.replace('/');
                }
                toast.success("Login Berhasil");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFC] p-4 md:p-6">
            <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 relative">
                <Link href="/" className="absolute top-8 right-8 p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl">
                    <X size={20} />
                </Link>

                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-3xl text-white mb-6 shadow-xl shadow-blue-100">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Pintar<span className="text-blue-600">Lokal</span></h1>

                    <div className="flex bg-slate-100 p-1.5 rounded-2xl mt-8">
                        <button type="button" onClick={() => setUserType('buyer')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${userType === 'buyer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Cari Jasa</button>
                        <button type="button" onClick={() => setUserType('mitra')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${userType === 'mitra' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Jadi Mitra</button>
                    </div>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                    {isRegistering && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{userType === 'mitra' ? 'Nama Usaha' : 'Nama Lengkap'}</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 text-sm" placeholder="Contoh: Berkah AC" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 text-sm" placeholder="nama@email.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 text-sm" placeholder="••••••••" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <>{isRegistering ? "Lanjut ke Pembayaran" : "Masuk"} <ArrowRight size={16} /></>}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-50">
                    <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-[11px] text-slate-400 font-bold uppercase tracking-widest hover:text-blue-600 transition">
                        {isRegistering ? "Sudah punya akun? Login" : "Belum punya akun? Daftar"}
                    </button>
                </div>
            </div>
        </div>
    );
}