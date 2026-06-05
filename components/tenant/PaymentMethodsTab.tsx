"use client";

import { useState } from "react";
import { CreditCard, DollarSign, QrCode, ToggleLeft, ToggleRight } from "lucide-react";

interface PaymentConfig {
    id: string;
    name: string;
    type: "online" | "entrega";
    icon: React.ReactNode;
    active: boolean;
    fee: number;
}

export default function PaymentMethodsTab() {
    const [methods, setMethods] = useState<PaymentConfig[]>([
        { id: "pix", name: "Pix Instantâneo (App)", type: "online", icon: <QrCode size={18} />, active: true, fee: 0 },
        { id: "cc_online", name: "Cartão de Crédito (Pelo App)", type: "online", icon: <CreditCard size={18} />, active: true, fee: 2.99 },
        { id: "money", name: "Dinheiro (Na Entrega)", type: "entrega", icon: <DollarSign size={18} />, active: true, fee: 0 },
        { id: "cc_delivery", name: "Cartão de Crédito (Maquininha)", type: "entrega", icon: <CreditCard size={18} />, active: true, fee: 0 },
        { id: "cd_delivery", name: "Cartão de Débito (Maquininha)", type: "entrega", icon: <CreditCard size={18} />, active: true, fee: 0 },
        { id: "vr_delivery", name: "Vale Refeição (Alelo/Sodexo)", type: "entrega", icon: <CreditCard size={18} />, active: false, fee: 0 },
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-slate-900">Formas de Pagamento</h2>
                <p className="text-xs text-slate-500 mt-0.5">Defina os métodos aceitos no seu cardápio e configure taxas adicionais se necessário.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Pagamentos Direto pelo App</h3>
                    <div className="space-y-3">
                        {methods.filter(m => m.type === "online").map((m) => (
                            <div key={m.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-900 text-white rounded-lg">{m.icon}</div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                                        {m.fee > 0 && <p className="text-[10px] text-slate-400">Taxa do gateway: {m.fee}%</p>}
                                    </div>
                                </div>
                                <button onClick={() => setMethods(methods.map(x => x.id === m.id ? {...x, active: !x.active} : x))} className="cursor-pointer">
                                    {m.active ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Pagamentos na Entrega</h3>
                    <div className="space-y-3">
                        {methods.filter(m => m.type === "entrega").map((m) => (
                            <div key={m.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg">{m.icon}</div>
                                    <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                                </div>
                                <button onClick={() => setMethods(methods.map(x => x.id === m.id ? {...x, active: !x.active} : x))} className="cursor-pointer">
                                    {m.active ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}