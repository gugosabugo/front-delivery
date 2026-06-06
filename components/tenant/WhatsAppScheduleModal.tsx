"use client";

import { useState } from "react";
import { X, MessageSquare } from "lucide-react";
import { Coupon } from "@/types/tenant";

interface WhatsAppScheduleModalProps {
    coupon: Coupon;
    onClose: () => void;
}

export default function WhatsAppScheduleModal({ coupon, onClose }: WhatsAppScheduleModalProps) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [targetAudience, setTargetAudience] = useState("all");

    const handleSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Disparo programado com sucesso!\nCupom: ${coupon.code}\nData: ${date} às ${time}\nPúblico: ${targetAudience === "all" ? "Todos os clientes" : "Clientes inativos há +30 dias"}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
                    <div className="flex items-center gap-2 text-emerald-700">
                        <MessageSquare size={18} className="stroke-[2.5]" />
                        <h3 className="font-black text-slate-900 text-base">Programar Disparo WhatsApp</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSchedule} className="p-6 space-y-4">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs text-slate-600">
                        Você está programando o envio do cupom <span className="font-bold text-slate-900">{coupon.code}</span> que oferece um desconto de <span className="font-bold text-slate-900">{coupon.type === "percentage" ? `${coupon.value}%` : `R$ ${coupon.value.toFixed(2)}`}</span>.
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Data de Envio</label>
                            <input 
                                type="date" 
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 font-semibold text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Horário do Disparo</label>
                            <input 
                                type="time" 
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 font-semibold text-slate-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Público-Alvo</label>
                        <select 
                            value={targetAudience} 
                            onChange={(e) => setTargetAudience(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 font-semibold text-slate-700"
                        >
                            <option value="all">Todos os clientes da base</option>
                            <option value="inactive">Clientes inativos (há mais de 30 dias sem pedir)</option>
                            <option value="vip">Clientes VIP (com mais de 5 pedidos no mês)</option>
                        </select>
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
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            Confirmar Agendamento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}