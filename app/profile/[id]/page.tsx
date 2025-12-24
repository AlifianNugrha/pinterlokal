"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import {
    MessageSquare, Star, MapPin,
    CheckCircle2, Loader2, ArrowLeft,
    ShieldCheck, Lock, X, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PublicProfile() {
    const { id } = useParams();
    const router = useRouter();

    // States
    const [profile, setProfile] = useState<any>(null);
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedWork, setSelectedWork] = useState<any>(null);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    // --- LOGIKA SMART WHATSAPP ---
    const generateWAMessage = () => {
        if (!profile) return "#";
        const message = `Halo ${profile.name}, saya melihat profil Anda di PintarLokal. Saya tertarik dengan jasa ${profile.category || 'Anda'}. Bisa bantu saya?`;
        return `https://wa.me/${profile.whatsapp_number}?text=${encodeURIComponent(message)}`;
    };

    const calculateRating = (reviewsData: any[]) => {
        if (!reviewsData || reviewsData.length === 0) return 0;
        const total = reviewsData.reduce((acc, curr) => acc + curr.rating, 0);
        return total / reviewsData.length;
    };

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                // 1. Fetch Profile
                const { data: profileData } = await supabase
                    .from('providers')
                    .select('*')
                    .eq('user_id', id)
                    .maybeSingle();
                setProfile(profileData);

                // 2. Fetch Portfolio
                const { data: portfolioData } = await supabase
                    .from('portfolio')
                    .select('*')
                    .eq('user_id', id)
                    .order('created_at', { ascending: false });
                setPortfolio(portfolioData || []);

                // 3. Fetch Reviews
                const { data: reviewsData } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('provider_id', id)
                    .order('created_at', { ascending: false });

                setReviews(reviewsData || []);
                setAverageRating(calculateRating(reviewsData || []));

                // 4. Get Current Auth User
                const { data: { user } } = await supabase.auth.getUser();
                setCurrentUser(user);

            } catch (err: any) {
                toast.error("Gagal memuat data profil");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPublicData();
    }, [id]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error("Silakan login terlebih dahulu");
            return;
        }

        setSubmitting(true);
        try {
            const fullName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0];
            const avatarUrl = currentUser.user_metadata?.avatar_url || "";

            const { error } = await supabase.from('reviews').insert([
                {
                    provider_id: id,
                    user_id: currentUser.id,
                    reviewer_name: fullName,
                    reviewer_avatar: avatarUrl,
                    rating: newReview.rating,
                    comment: newReview.comment
                }
            ]);

            if (error) throw error;

            toast.success("Ulasan berhasil dikirim!");
            setNewReview({ rating: 5, comment: '' });

            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('provider_id', id)
                .order('created_at', { ascending: false });
            setReviews(data || []);
            setAverageRating(calculateRating(data || []));

        } catch (err: any) {
            toast.error(err.message || "Gagal mengirim ulasan");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <p className="text-slate-400 font-medium italic">Profil tidak ditemukan</p>
            <Link href="/" className="mt-4 text-[10px] font-bold text-blue-600 uppercase tracking-widest underline">Kembali ke Beranda</Link>
        </div>
    );

    const isOwnProfile = currentUser?.id === id;

    return (
        <div className="min-h-screen bg-[#FBFBFC] text-slate-900 pb-20 font-sans">
            <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                        <span className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kembali</span>
                    </button>
                    <Link href="/" className="text-[10px] font-bold text-slate-900 bg-slate-100 px-5 py-2.5 rounded-xl uppercase tracking-widest">Home</Link>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
                {/* Header Profile */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
                    <div className="p-8 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] bg-slate-50 overflow-hidden border-4 border-white shadow-2xl">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt={profile.name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-100 font-bold text-4xl italic">
                                        {profile.name?.substring(0, 1).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-5">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase italic mb-2">
                                    {profile.name}
                                </h1>
                                <p className="text-blue-600 font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase">
                                    Professional {profile.category || "Service"}
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-xs font-bold">
                                    <Star className={`w-3.5 h-3.5 ${averageRating > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                                    <span>{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
                                    <span className="text-slate-400 font-normal ml-1">({reviews.length} Ulasan)</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-xs text-slate-500 font-medium italic">
                                    <MapPin className="w-3.5 h-3.5" /> {profile.city || "Surakarta"}
                                </div>
                            </div>

                            <div className="pt-4">
                                <a href={generateWAMessage()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-bold text-xs hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200 tracking-[0.1em] uppercase active:scale-95">
                                    <MessageSquare className="w-5 h-5" /> Hubungi via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
                    <div className="lg:col-span-2 space-y-20">
                        {/* Portfolio */}
                        <section>
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">Portofolio Kerja</h2>
                                <div className="h-[1px] flex-1 bg-slate-100 ml-8"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-5 md:gap-8">
                                {portfolio.length === 0 ? (
                                    <div className="col-span-2 py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 text-[10px] uppercase font-bold tracking-widest italic">Belum ada portofolio</div>
                                ) : portfolio.map((work) => (
                                    <div key={work.id} onClick={() => setSelectedWork(work)} className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group overflow-hidden">
                                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden">
                                            <img src={work.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Testimonials */}
                        <section>
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">Testimoni Pelanggan</h2>
                                <div className="h-[1px] flex-1 bg-slate-100 ml-8"></div>
                            </div>
                            <div className="space-y-6">
                                {reviews.length === 0 ? (
                                    <div className="bg-white p-16 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 italic text-[10px] uppercase tracking-widest font-bold">Belum ada ulasan masuk.</div>
                                ) : reviews.map((rev) => (
                                    <div key={rev.id} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 shadow-sm">
                                                    {rev.reviewer_avatar ? (
                                                        <img src={rev.reviewer_avatar} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-sm">
                                                            {rev.reviewer_name?.substring(0, 1).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 text-sm uppercase italic tracking-tight">{rev.reviewer_name}</h4>
                                                    <div className="flex gap-0.5 mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-100'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(rev.created_at).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <p className="text-sm md:text-[15px] text-slate-600 italic font-light leading-relaxed">"{rev.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-12">
                        {/* KEUNGGULAN JASA - MENAMPILKAN 4 INPUT DARI EDIT PROFILE */}
                        {profile.features && profile.features.length > 0 && (
                            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-8 italic flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Keunggulan Kami
                                </h3>
                                <div className="grid grid-cols-1 gap-5">
                                    {profile.features.map((feature: string, index: number) => (
                                        <div key={index} className="flex items-center gap-4 group">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-150 transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                                            <span className="text-xs font-black text-slate-700 uppercase italic tracking-tight leading-none">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 italic">Bio & Deskripsi</h3>
                            <p className="text-sm leading-relaxed text-slate-600 font-light italic">
                                {profile.bio || "Penyedia jasa profesional berpengalaman."}
                            </p>
                        </section>

                        <section className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl sticky top-24">
                            <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-8 italic">Berikan Rating</h3>

                            {!currentUser ? (
                                <div className="text-center py-10 bg-white/5 rounded-[2rem] border border-white/10">
                                    <Lock className="w-8 h-8 mx-auto mb-4 text-slate-500" />
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-6 px-4 leading-relaxed font-bold">Login untuk memberikan testimoni Anda</p>
                                    <Link href="/login" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg">MASUK</Link>
                                </div>
                            ) : isOwnProfile ? (
                                <div className="text-center py-10 bg-white/5 rounded-[2rem] border border-white/10 px-6">
                                    <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-black italic mb-2">Ini Profil Anda</p>
                                    <p className="text-[11px] text-slate-400 italic leading-relaxed">Anda tidak dapat memberikan ulasan untuk layanan Anda sendiri.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="space-y-5">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                                            {currentUser.email?.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="truncate flex-1">
                                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Anda Mengulas</p>
                                            <p className="text-xs text-white truncate font-medium">{currentUser.user_metadata?.full_name || currentUser.email}</p>
                                        </div>
                                    </div>

                                    <select
                                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-xs outline-none focus:border-blue-500 transition-all text-slate-200 appearance-none font-bold"
                                        value={newReview.rating}
                                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                    >
                                        <option className="text-slate-900" value="5">Sempurna (5/5)</option>
                                        <option className="text-slate-900" value="4">Sangat Bagus (4/5)</option>
                                        <option className="text-slate-900" value="3">Cukup (3/5)</option>
                                        <option className="text-slate-900" value="2">Kurang Baik (2/5)</option>
                                        <option className="text-slate-900" value="1">Buruk (1/5)</option>
                                    </select>

                                    <textarea
                                        placeholder="Ceritakan pengalaman Anda..."
                                        required
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs outline-none focus:border-blue-500 transition-all resize-none text-white leading-relaxed placeholder:text-slate-600 font-light italic"
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    ></textarea>

                                    <button
                                        disabled={submitting}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'KIRIM TESTIMONI'}
                                    </button>
                                </form>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            {/* Modal Portfolio Detail */}
            {selectedWork && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/98 backdrop-blur-xl" onClick={() => setSelectedWork(null)}></div>
                    <div className="relative bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
                        <button onClick={() => setSelectedWork(null)} className="absolute top-6 right-6 z-20 bg-white shadow-xl hover:bg-red-50 p-3 rounded-2xl text-slate-900 transition-all">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="w-full md:w-2/3 bg-slate-50 flex items-center justify-center overflow-hidden">
                            <img src={selectedWork.image_url} className="w-full h-full object-contain" alt="" />
                        </div>
                        <div className="w-full md:w-1/3 p-10 md:p-14 flex flex-col justify-center bg-white">
                            <h2 className="text-2xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">Hasil Kerja</h2>
                            <p className="text-sm text-slate-500 italic leading-relaxed mb-8">"{selectedWork.description || "Dikerjakan dengan dedikasi profesional."}"</p>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] border-t border-slate-50 pt-6 flex items-center gap-3 italic">
                                <ShieldCheck className="w-4 h-4 text-blue-600" /> Jasa Terverifikasi
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}