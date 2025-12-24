"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Plus, Trash2, Loader2, Image as ImageIcon,
    AlertCircle, CheckCircle2, X
} from 'lucide-react';

export default function GalleryPage() {
    const router = useRouter();
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        fetchGallery();
    }, []);

    async function fetchGallery() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return router.push('/login');

            const { data, error } = await supabase
                .from('portfolio')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (err: any) {
            console.error("Fetch Error:", err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran file (maks 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setStatus({ type: 'error', msg: 'File terlalu besar. Maksimal 2MB.' });
            return;
        }

        setUploading(true);
        setStatus({ type: '', msg: '' });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Sesi berakhir, silakan login kembali.");

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            // 1. Upload ke Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('portfolio-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                if (uploadError.message.includes("Bucket not found")) {
                    throw new Error("Bucket 'portfolio-images' belum dibuat di Supabase Storage.");
                }
                throw uploadError;
            }

            // 2. Ambil Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio-images')
                .getPublicUrl(fileName);

            // 3. Simpan ke Database Tabel Portfolio
            const { error: dbError } = await supabase
                .from('portfolio')
                .insert([{
                    user_id: user.id,
                    image_url: publicUrl
                }]);

            if (dbError) throw dbError;

            setStatus({ type: 'success', msg: 'Foto portfolio berhasil ditambahkan!' });
            fetchGallery(); // Refresh list gambar
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message });
        } finally {
            setUploading(false);
            // Reset input file
            e.target.value = '';
        }
    };

    const deleteImage = async (id: string, url: string) => {
        if (!confirm("Hapus foto ini dari portfolio Anda?")) return;

        try {
            // Ambil path file dari URL
            const urlParts = url.split('/');
            const fileName = urlParts.slice(-2).join('/'); // Mengambil folder user_id/namafile

            // 1. Hapus dari Storage
            const { error: storageError } = await supabase.storage
                .from('portfolio-images')
                .remove([fileName]);

            if (storageError) throw storageError;

            // 2. Hapus dari Database
            const { error: dbError } = await supabase
                .from('portfolio')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            setImages(images.filter(img => img.id !== id));
            setStatus({ type: 'success', msg: 'Foto telah dihapus.' });
        } catch (err: any) {
            setStatus({ type: 'error', msg: "Gagal menghapus foto." });
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all text-[11px] font-bold uppercase tracking-widest mb-4"
                        >
                            <ArrowLeft size={14} /> Kembali ke Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gallery Portfolio</h1>
                        <p className="text-sm text-slate-500 font-normal">Tampilkan hasil kerja terbaik untuk meyakinkan pelanggan.</p>
                    </div>

                    <label className="cursor-pointer bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 disabled:opacity-50">
                        {uploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={20} />}
                        {uploading ? "SEDANG MENGUNGGAH..." : "UNGGAH HASIL KERJA"}
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleUpload}
                            accept="image/*"
                            disabled={uploading}
                        />
                    </label>
                </header>

                {/* Status Alert */}
                {status.msg && (
                    <div className={`mb-8 p-4 rounded-2xl flex items-center justify-between font-medium text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        <div className="flex items-center gap-3">
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {status.msg}
                        </div>
                        <button onClick={() => setStatus({ type: '', msg: '' })}><X size={16} /></button>
                    </div>
                )}

                {/* Gallery Grid */}
                {images.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                            <ImageIcon size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada foto portfolio</h3>
                        <p className="text-sm text-slate-400 max-w-sm font-normal">
                            Klik tombol "Unggah Hasil Kerja" di atas untuk menambahkan foto-foto hasil pekerjaan Anda.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {images.map((img) => (
                            <div key={img.id} className="group relative bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-100">
                                    <img
                                        src={img.image_url}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt="Hasil Kerja"
                                    />
                                </div>

                                {/* Overlay Delete Button */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem] flex items-center justify-center">
                                    <button
                                        onClick={() => deleteImage(img.id, img.image_url)}
                                        className="bg-white text-red-600 p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-2xl flex items-center gap-2 font-bold text-xs"
                                    >
                                        <Trash2 size={18} /> HAPUS FOTO
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}