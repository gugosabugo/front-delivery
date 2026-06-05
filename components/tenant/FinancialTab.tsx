"use client";

import { DollarSign, TrendingUp, ShoppingBag, ArrowUpRight } from "lucide-react";

export default function FinancialTab() {
    const metrics = { totalRevenue: 4890.50, orderCount: 142, ticketMedio: 34.44 };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-slate-900">Dashboard Financeiro</h2>
                <p className="text-xs text-slate-500 mt-0.5">Acompanhe as vendas brutas e lucratividade líquida.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faturamento Total</span>
                    <div className="text-2xl font-black text-slate-900">{metrics.totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                    <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md"><ArrowUpRight size={12} /> +12.4%</div>
                    <DollarSign size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pedidos Concluídos</span>
                    <div className="text-2xl font-black text-slate-900">{metrics.orderCount} ordens</div>
                    <ShoppingBag size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ticket Médio Geral</span>
                    <div className="text-2xl font-black text-slate-900">{metrics.ticketMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                    <TrendingUp size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}