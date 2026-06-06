"use client";

import { useState } from "react";
import { Ticket, Plus, Trash2, Power, MessageSquare } from "lucide-react";
import { Coupon } from "@/types/tenant";
import CouponFormModal from "./CouponFormModal";
import WhatsAppScheduleModal from "./WhatsAppScheduleModal";

interface CouponsTabProps {
    coupons: Coupon[];
    setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
}

export default function CouponsTab({ coupons, setCoupons }: CouponsTabProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCouponToSchedule, setSelectedCouponToSchedule] = useState<Coupon | null>(null);

    const toggleCouponStatus = (id: string) => {
        setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    };

    const deleteCoupon = (id: string) => {
        if (confirm("Tem certeza que deseja excluir este cupom?")) {
            setCoupons(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleCreateCoupon = (newCouponData: Omit<Coupon, "id" | "usedCount">) => {
        const newCoupon: Coupon = {
            ...newCouponData,
            id: String(Date.now()),
            usedCount: 0
        };
        setCoupons(prev => [newCoupon, ...prev]);
        setIsCreateModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-black text-slate-900">Cupons de Desconto</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Crie códigos promocionais e programe disparos de engajamento.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                >
                    <Plus size={16} /> Novo Cupom
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map(coupon => (
                    <div key={coupon.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden group flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg ${coupon.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Ticket size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 tracking-wide">{coupon.code}</h3>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${coupon.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {coupon.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => deleteCoupon(coupon.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>

                            <div className="space-y-1 mb-4">
                                <p className="text-sm font-semibold text-slate-700">
                                    Desconto de: <span className="font-black text-slate-900">
                                        {coupon.type === 'percentage' ? `${coupon.value}%` : `R$ ${coupon.value.toFixed(2)}`}
                                    </span>
                                </p>
                                <p className="text-xs text-slate-500">Utilizado {coupon.usedCount} vezes</p>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2">
                            <button 
                                onClick={() => toggleCouponStatus(coupon.id)}
                                className={`flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                    coupon.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                            >
                                <Power size={14} /> {coupon.active ? 'Desativar' : 'Ativar'}
                            </button>

                            {/* Botão de Disparo WhatsApp */}
                            <button 
                                onClick={() => setSelectedCouponToSchedule(coupon)}
                                disabled={!coupon.active}
                                className={`flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${
                                    coupon.active 
                                    ? 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50' 
                                    : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                                }`}
                                title={!coupon.active ? "Ative o cupom para poder programar envios" : ""}
                            >
                                <MessageSquare size={14} /> Enviar Whats
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Renderização Condicional dos Modais */}
            {isCreateModalOpen && (
                <CouponFormModal 
                    onClose={() => setIsCreateModalOpen(false)} 
                    onSave={handleCreateCoupon} 
                />
            )}

            {selectedCouponToSchedule && (
                <WhatsAppScheduleModal 
                    coupon={selectedCouponToSchedule} 
                    onClose={() => setSelectedCouponToSchedule(null)} 
                />
            )}
        </div>
    );
}