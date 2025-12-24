"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    LogOut,
    Eye,
    MessageSquare,
    Star,
    ExternalLink,
    Settings,
    Loader2,
    Image as ImageIcon,
    TrendingUp,
    Share2,
    Trash2,
    AlertCircle,
    ArrowUpRight,
    Sparkles,
    Home // Icon tambahan untuk Beranda
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/login');
                    return;
                }

                const { data: profileData, error: profileError } = await supabase
                    .from('providers')
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (profileError) throw profileError;
                setProfile(profileData);

                const { data: reviewsData } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('provider_id', user.id)
                    .order('created_at', { ascending: false });

                setReviews(reviewsData || []);

            } catch (err: any) {
                console.error("Dashboard Error:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    const handleDeleteReview = async (id: string) => {
        if (!confirm('Hapus ulasan ini secara permanen?')) return;
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (!error) {
            setReviews(reviews.filter(r => r.id !== id));
            toast.success("Ulasan berhasil dihapus");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Menyinkronkan Data...</p>
            </div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 max-w-sm text-center border border-white">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-amber-500" size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-3 tracking-tighter">Profil Tertunda</h2>
                <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]">Muat Ulang</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-slate-900">

            {/* --- SIDEBAR --- */}
            <aside className="w-full md:w-72 bg-white border-r border-slate-200/60 p-8 flex flex-col sticky top-0 h-screen z-50">
                <div className="mb-12">
                    <Link href="/" className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2 italic uppercase">
                        Pintar<span className="text-blue-600">Lokal</span>
                    </Link>
                </div>

                <nav className="space-y-1.5 flex-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] px-4 mb-6">Main Console</p>

                    {/* MENU BARU: KEMBALI KE LANDING PAGE */}
                    <NavItem icon={<Home size={18} />} label="Beranda Utama" href="/" />

                    <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
                    <NavItem icon={<ImageIcon size={18} />} label="Portfolio" href="/dashboard/gallery" />
                    <NavItem icon={<Settings size={18} />} label="Konfigurasi" href="/dashboard/edit" />

                    <div className="pt-8 opacity-40">
                        <NavItem
                            icon={<ExternalLink size={18} />}
                            label="Lihat Live"
                            href={`/profile/${profile.user_id}`}
                            isExternal
                        />
                    </div>
                </nav>

                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        router.push('/login');
                    }}
                    className="flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-red-600 font-bold text-[11px] uppercase tracking-widest transition-all rounded-2xl hover:bg-red-50"
                >
                    <LogOut size={18} /> Keluar Sesi
                </button>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-6 md:p-14 overflow-y-auto max-w-7xl mx-auto w-full">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full mb-3 border border-green-100">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Sistem Online</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Halo, {profile.name?.split(' ')[0] || 'Mitra'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-slate-200/50 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-blue-600 font-black italic text-lg">{profile.name?.charAt(0)}</span>
                            )}
                        </div>
                        <div className="pr-6">
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter line-clamp-1">{profile.name}</p>
                            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest opacity-70 italic">{profile.category}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard label="Impression" value="2,481" icon={<Eye size={20} />} color="blue" />
                    <StatCard label="Ulasan Masuk" value={reviews.length} icon={<MessageSquare size={20} />} color="slate" />
                    <StatCard label="Rating Bisnis" value={reviews.length > 0 ? "4.9" : "0.0"} icon={<Star size={20} fill="currentColor" />} color="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white border border-slate-200/60 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] mb-10 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full" /> Informasi Bisnis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                <InfoBlock label="WhatsApp" value={profile.whatsapp_number || '-'} />
                                <InfoBlock label="Wilayah Cakupan" value={profile.location || profile.city || 'Surakarta'} />
                                <InfoBlock label="Kategori" value={profile.category || 'Umum'} />
                                <InfoBlock label="ID Mitra" value={`#PL-${profile.user_id?.slice(0, 8).toUpperCase()}`} />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/60 rounded-[3rem] shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50">
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">Ulasan Terbaru</h3>
                            </div>
                            <div className="p-4 md:p-8 space-y-4">
                                {reviews.length === 0 ? (
                                    <p className="text-center py-10 text-[10px] font-black text-slate-300 uppercase tracking-widest">Belum ada feedback</p>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev.id} className="flex items-start justify-between p-6 bg-[#FBFBFC] rounded-[2rem] border border-transparent hover:border-blue-100 transition-all group">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">{rev.reviewer_name?.charAt(0)}</div>
                                                <div>
                                                    <p className="font-black text-xs text-slate-900 uppercase italic">{rev.reviewer_name}</p>
                                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">"{rev.comment}"</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteReview(rev.id)} className="p-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-blue-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-blue-200">
                            <Share2 size={32} className="mb-6 opacity-50" />
                            <h4 className="text-xl font-black italic uppercase tracking-tighter mb-2">Lihat Profil</h4>
                            <p className="text-blue-100 text-sm mb-8 leading-relaxed font-medium">Cek tampilan profil publik yang dilihat pelanggan.</p>
                            <Link
                                href={`/profile/${profile.user_id}`}
                                target="_blank"
                                className="flex items-center justify-between w-full p-4 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-lg"
                            >
                                Buka Live Profile <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        <div className="bg-white border border-slate-200/60 rounded-[3rem] p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles size={14} className="text-amber-500" /> Keunggulan</h4>
                            <div className="space-y-3">
                                {profile.features?.map((feat: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600"><Star size={10} fill="currentColor" /></div>
                                        <p className="text-[10px] font-bold uppercase text-slate-600 italic">{feat}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false, href = "#", isExternal = false }: any) {
    const Component = isExternal ? 'a' : Link;
    return (
        <Component href={href} target={isExternal ? "_blank" : "_self"} className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-xs transition-all ${active ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
            {icon}
            <span className="uppercase tracking-widest text-[10px]">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />}
        </Component>
    );
}

function StatCard({ label, value, icon, color }: any) {
    const colors: any = { blue: 'text-blue-600 bg-blue-50', amber: 'text-amber-500 bg-amber-50', slate: 'text-slate-600 bg-slate-50' };
    return (
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group">
            <div className={`p-4 rounded-2xl w-fit mb-8 ${colors[color]}`}>{icon}</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{value}</p>
        </div>
    );
}

function InfoBlock({ label, value }: any) {
    return (
        <div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-slate-900 tracking-tight uppercase italic">{value}</p>
        </div>
    );
}