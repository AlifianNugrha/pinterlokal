"use client";

import { useState, Suspense } from 'react'; // Tambahkan Suspense
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

// 1. Pindahkan logika utama ke komponen terpisah
function PaymentContent() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || 'Mitra';

    const handlePaymentAndSignUp = async () => {
        setLoading(true);
        try {
            const rawData = sessionStorage.getItem('pending_registration');
            if (!rawData) throw new Error("Data pendaftaran hilang. Silakan daftar ulang.");

            const { email, password, name: fullName, userType } = JSON.parse(rawData);

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName, role: userType } }
            });

            if (authError) throw authError;

            if (authData.user) {
                const { error: dbError } = await supabase.from('providers').insert([
                    {
                        user_id: authData.user.id,
                        name: fullName,
                        email: email,
                        category: 'Jasa Umum',
                        is_active: true
                    }
                ]);

                if (dbError) throw dbError;

                sessionStorage.removeItem('pending_registration');
                toast.success("Pembayaran Berhasil! Selamat datang Mitra.");

                setTimeout(() => {
                    router.push('/dashboard');
                    router.refresh();
                }, 1500);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center p-4">
            <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-blue-100">
                    <div className="p-4"><CreditCard size={32} /></div>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Aktivasi Mitra</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Selesaikan pembayaran <span className="text-slate-900 font-bold">Rp 50.000</span> untuk mengaktifkan usaha <span className="text-blue-600 font-bold">{name}</span>
                </p>

                <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 text-left space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Total Bayar</span>
                        <span className="text-slate-900 italic">Rp 50.000</span>
                    </div>
                </div>

                <button
                    onClick={handlePaymentAndSignUp}
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>Bayar & Masuk Dashboard <ArrowRight size={16} /></>
                    )}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    <ShieldCheck size={12} className="text-green-500" /> Transaksi Terenkripsi
                </div>
            </div>
        </div>
    );
}

// 2. Fungsi Utama yang diexport harus dibungkus Suspense
export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}

// trigger build baru