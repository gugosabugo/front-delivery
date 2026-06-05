"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";

interface SettingsTabProps {
    storeName: string;
    setStoreName: (name: string) => void;
    deliveryFee: string;
    setDeliveryFee: (fee: string) => void;
    deliveryTime: string;
    setDeliveryTime: (time: string) => void;
    logoImg: string | null;
    setLogoImg: (img: string | null) => void;
    bannerImg: string | null;
    setBannerImg: (img: string | null) => void;
}

export default function SettingsTab({
    storeName, setStoreName, deliveryFee, setDeliveryFee, deliveryTime, setDeliveryTime,
    logoImg, setLogoImg, bannerImg, setBannerImg
}: SettingsTabProps) {
    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'logo') setLogoImg(reader.result as string);
                else setBannerImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Identidade Visual</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Foto de Capa (Banner)</label>
                        <div onClick={() => bannerInputRef.current?.click()} className="h-32 bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden cursor-pointer relative group flex items-center justify-center">
                            {bannerImg ? <img src={bannerImg} alt="Banner" className="w-full h-full object-cover" /> : <div className="text-slate-400 flex flex-col items-center gap-1 text-xs"><Upload size={18} />Clique para upar</div>}
                            <div className="absolute inset-0 bg-black/40 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">Alterar Capa</div>
                        </div>
                        <input type="file" ref={bannerInputRef} accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'banner')} />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Logo (Perfil)</label>
                        <div onClick={() => logoInputRef.current?.click()} className="h-32 w-32 mx-auto md:mx-0 bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden cursor-pointer relative group flex items-center justify-center">
                            {logoImg ? <img src={logoImg} alt="Logo" className="w-full h-full object-cover" /> : <div className="text-slate-400 flex flex-col items-center gap-1 text-xs"><Upload size={18} />Upar Logo</div>}
                            <div className="absolute inset-0 bg-black/40 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-2">Alterar Logo</div>
                        </div>
                        <input type="file" ref={logoInputRef} accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'logo')} />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-6">
                <h3 className="text-sm font-bold text-slate-900">Configurações Gerais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nome Fantasia</label>
                        <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Taxa de Entrega Padrão</label>
                        <input type="text" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tempo de Entrega Estimado</label>
                        <input type="text" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                    </div>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-end">
                    <button onClick={() => alert("Alterações salvas!")} className="bg-slate-950 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 cursor-pointer">Salvar Alterações</button>
                </div>
            </div>
        </div>
    );
}