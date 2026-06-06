"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Coupon } from "@/types/tenant";

interface CouponFormModalProps {
    onClose: () => void;
    onSave: (coupon: Omit<Coupon, "id" | "usedCount">) => void;
}

export default function CouponFormModal({ onClose, onSave }: CouponFormModalProps) {
    const [code, setCode] = useState("");
    const [type, setType] = useState<"percentage" | "fixed">("percentage");
    const [value, setValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || !value) return;

        onSave({
            code: code.toUpperCase().trim(),
            type,
            value: Number(value),
            active: true
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-base">Criar Novo Cupom</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Código do Cupom</label>
                        <input 
                            type="text" 
                            required
                            placeholder="EX: QUERO10" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 font-bold uppercase tracking-wider"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tipo de Desconto</label>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 font-semibold text-slate-700"
                            >
                                <option value="percentage">Porcentagem (%)</option>
                                <option value="fixed">Valor Fixo (R$)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Valor do Desconto</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                step="any"
                                placeholder={type === "percentage" ? "10" : "5.00"}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 font-semibold"
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Salvar Cupom
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}