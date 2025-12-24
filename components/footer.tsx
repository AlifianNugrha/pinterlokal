"use client";

import { Instagram, Twitter, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-24 pb-12 px-6 overflow-hidden relative">
            {/* Dekorasi Cahaya */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -mt-48"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

                    {/* Brand Section */}
                    <div className="md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            {/* Ikon petir dihapus, hanya teks Brand */}
                            <span className="font-bold tracking-tighter text-2xl italic">
                                Pintar<span className="text-blue-500">Lokal</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-xs leading-relaxed font-light">
                            Menghubungkan ahli profesional dengan pelanggan lokal di Surakarta secara transparan dan terpercaya.
                        </p>
                    </div>

                    {/* Navigasi Cepat */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">Layanan Solo</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-300">
                            <li><Link href="/search?q=AC" className="hover:text-blue-400 transition-colors">Servis AC</Link></li>
                            <li><Link href="/search?q=Listrik" className="hover:text-blue-400 transition-colors">Instalasi Listrik</Link></li>
                            <li><Link href="/search?q=Tukang" className="hover:text-blue-400 transition-colors">Tukang Bangunan</Link></li>
                        </ul>
                    </div>

                    {/* Bantuan */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">Mitra</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-300">
                            <li><Link href="/login" className="hover:text-blue-400 transition-colors">Daftar Jadi Mitra</Link></li>
                            <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard Mitra</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Pusat Bantuan</Link></li>
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">Hubungi Kami</h4>
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                            <Mail size={16} className="text-blue-500" />
                            <span>halo@pintarlokal.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                            <MapPin size={16} className="text-blue-500" />
                            <span>Surakarta, Jawa Tengah</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        © 2025 PINTARLOKAL SURAKARTA. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Instagram size={20} /></Link>
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter size={20} /></Link>
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Mail size={20} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}