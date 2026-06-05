"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, ShieldAlert } from "lucide-react";

interface DeliveryArea {
    id: number;
    neighborhood: string;
    fee: number;
    time: string;
}

export default function DeliveryAreasTab() {
    const [areas, setAreas] = useState<DeliveryArea[]>([
        { id: 1, neighborhood: "Centro", fee: 5.00, time: "25-35 min" },
        { id: 2, neighborhood: "Jardim Europa", fee: 7.00, time: "35-45 min" },
    ]);
    const [newNeigh, setNewNeigh] = useState("");
    const [newFee, setNewFee] = useState("");

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNeigh.trim() || !newFee) return;
        setAreas([...areas, { id: Date.now(), neighborhood: newNeigh.trim(), fee: parseFloat(newFee), time: "30-40 min" }]);
        setNewNeigh("");
        setNewFee("");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-slate-900">Áreas de Entrega (Logística)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Cadastre os bairros atendidos e mude os preços de entrega dinamicamente.</p>
            </div>
            <form onSubmit={handleAdd} className="bg-white border border-slate-200 p-5 rounded-xl flex gap-3 items-end">
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome do Bairro</label>
                    <input type="text" value={newNeigh} onChange={(e) => setNewNeigh(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" required />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Taxa (R$)</label>
                    <input type="number" step="0.01" value={newFee} onChange={(e) => setNewFee(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" required />
                </div>
                <button type="submit" className="bg-slate-950 text-white text-xs font-bold px-4 h-[33px] rounded-lg cursor-pointer"><Plus size={14} /></button>
            </form>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {areas.map(a => (
                    <div key={a.id} className="p-4 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2"><MapPin size={15} className="text-slate-400"/><strong>{a.neighborhood}</strong></div>
                        <div className="flex items-center gap-3">
                            <span className="font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200">{a.fee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                            <button onClick={() => setAreas(areas.filter(x => x.id !== a.id))} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
                {areas.length === 0 && <div className="p-6 text-center text-slate-400 flex flex-col items-center"><ShieldAlert size={20}/>Nenhuma região configurada.</div>}
            </div>
        </div>
    );
}