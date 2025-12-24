"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Save, Loader2, CheckCircle2,
    AlertCircle, User, MessageSquare, Briefcase,
    FileText, Camera, X, Plus, Sparkles
} from 'lucide-react';

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        whatsapp_number: '',
        bio: '',
        avatar_url: '',
        features: [] as string[] // State untuk keunggulan
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return router.push('/login');

            const { data, error } = await supabase
                .from('providers')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) throw error;
            if (data) {
                setFormData({
                    name: data.name || '',
                    category: data.category || '',
                    whatsapp_number: data.whatsapp_number || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || '',
                    features: data.features || []
                });
            }
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Fungsi Kelola Keunggulan
    const addFeature = () => {
        if (formData.features.length < 4) {
            setFormData({ ...formData, features: [...formData.features, ""] });
        }
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const removeFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Sesi berakhir");
            const fileExt = file.name.split('.').pop();
            const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
            setStatus({ type: 'success', msg: 'Foto profil terpilih!' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
        } catch (err: any) {
            setStatus({ type: 'error', msg: 'Gagal upload foto' });
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus({ type: '', msg: '' });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Silakan login kembali.");

            const { error } = await supabase
                .from('providers')
                .upsert({
                    user_id: user.id,
                    name: formData.name,
                    category: formData.category,
                    whatsapp_number: formData.whatsapp_number,
                    bio: formData.bio,
                    avatar_url: formData.avatar_url,
                    features: formData.features.filter(f => f.trim() !== ""), // Simpan yang tidak kosong
                    updated_at: new Date()
                }, { onConflict: 'user_id' });

            if (error) throw error;

            setStatus({ type: 'success', msg: 'Perubahan berhasil disimpan!' });
            setTimeout(() => {
                setStatus({ type: '', msg: '' });
                router.push('/dashboard');
            }, 2000);

        } catch (err: any) {
            setStatus({ type: 'error', msg: 'Gagal: ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-12 px-6 font-sans relative" style={{ fontFamily: "'Poppins', sans-serif" }}>

            {/* Pop-up Atas */}
            {status.msg && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
                    <div className={`flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${status.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 'bg-red-600 border-red-500 text-white'
                        }`}>
                        {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <p className="text-sm font-bold tracking-tight">{status.msg}</p>
                    </div>
                </div>
            )}

            <div className="max-w-2xl mx-auto">
                <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all text-[10px] font-bold uppercase tracking-widest mb-8">
                    <ArrowLeft size={14} /> Kembali
                </button>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-20">
                    <div className="p-8 md:p-12">
                        <header className="mb-10 text-center md:text-left font-bold italic text-2xl">Edit Profil</header>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Avatar */}
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 overflow-hidden border-2 border-slate-100 shadow-inner">
                                        {formData.avatar_url ? <img src={formData.avatar_url} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center text-slate-200 italic font-bold text-2xl">P</div>}
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg cursor-pointer border-4 border-white hover:scale-110 transition-all">
                                        <Camera size={16} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={saving} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Input Biasa */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1"><User size={12} /> Nama Usaha</label>
                                    <input type="text" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-600 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1"><MessageSquare size={12} /> WhatsApp (628xxx)</label>
                                    <input type="text" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-600 transition-all" value={formData.whatsapp_number} onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })} />
                                </div>

                                {/* INPUT KEUNGGULAN (MAX 4) */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles size={12} /> Keunggulan Jasa (Max 4)
                                        </label>
                                        <button type="button" onClick={addFeature} disabled={formData.features.length >= 4} className="text-blue-600 font-bold text-[10px] uppercase flex items-center gap-1 disabled:opacity-30">
                                            <Plus size={14} /> Tambah
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {formData.features.map((feature, index) => (
                                            <div key={index} className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Garansi 30 Hari"
                                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm outline-none focus:border-blue-600 transition-all"
                                                    value={feature}
                                                    onChange={(e) => updateFeature(index, e.target.value)}
                                                />
                                                <button type="button" onClick={() => removeFeature(index)} className="p-3 text-red-400 hover:text-red-600">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.features.length === 0 && (
                                            <p className="text-[10px] text-slate-400 italic px-1">Belum ada keunggulan yang ditambahkan.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1"><FileText size={12} /> Tentang Kami</label>
                                    <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-600 transition-all resize-none" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50">
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}