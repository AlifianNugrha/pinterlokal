"use client";

import { useEffect, useState } from 'react';
import { Sun, Moon, Languages } from 'lucide-react';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggle = () => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setIsDark(!isDark);
    };

    return (
        <button onClick={toggle} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 transition-all hover:scale-105 active:scale-95 border border-transparent dark:border-slate-700">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}

export function LanguageToggle() {
    const [lang, setLang] = useState('id');

    useEffect(() => {
        setLang(localStorage.getItem('lang') || 'id');
    }, []);

    const toggle = () => {
        const newLang = lang === 'id' ? 'en' : 'id';
        localStorage.setItem('lang', newLang);
        setLang(newLang);
        window.location.reload(); // Memastikan seluruh teks aplikasi berubah
    };

    return (
        <button onClick={toggle} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <Languages size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{lang}</span>
        </button>
    );
}