"use client";

import { Power } from "lucide-react";

interface TopbarProps {
    storeName: string;
    logoImg: string | null;
    isStoreOpen: boolean;
    setIsStoreOpen: (open: boolean) => void;
}

export default function Topbar({ storeName, logoImg, isStoreOpen, setIsStoreOpen }: TopbarProps) {
    return (
        <header className="bg-white border-b border-slate-200 shadow-3xs sticky top-0 z-40 w-full shrink-0">
            <div className="w-full px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {logoImg ? (
                        <img src={logoImg} className="w-9 h-9 rounded-xl object-cover border border-slate-200" alt="Logo" />
                    ) : (
                        <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">JL</div>
                    )}
                    <div>
                        <h1 className="text-xs font-bold text-slate-900 leading-none mb-0.5">{storeName}</h1>
                        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Painel de Operações</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsStoreOpen(!isStoreOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${isStoreOpen
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {isStoreOpen ? "Delivery Aberto" : "Delivery Fechado"}
                    </button>
                </div>
            </div>
        </header>
    );
}