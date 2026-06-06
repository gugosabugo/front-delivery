"use client";

import { useState } from "react";
import { 
    DollarSign, 
    ShoppingBag, 
    ArrowUpRight, 
    TrendingUp, 
    BarChart3, 
    Clock, 
    Utensils, 
    CreditCard,
    Calendar
} from "lucide-react";

export default function FinancialTab() {
    // Estado da sub-aba interna do relatório financeiro - Iniciando agora em faturamento
    const [activeSubTab, setActiveSubTab] = useState<"faturamento" | "produtos" | "horarios">("faturamento");

    // Estrutura de dados simulada completa
    const metrics = {
        totalRevenue: 4890.50,
        orderCount: 142,
        ticketMedio: 34.44
    };

    const paymentMethods = [
        { name: "Pix", percentage: 65, value: 3178.82, color: "bg-teal-500" },
        { name: "Cartão de Crédito", percentage: 25, value: 1222.62, color: "bg-blue-500" },
        { name: "Dinheiro", percentage: 10, value: 489.05, color: "bg-amber-500" },
    ];

    const topProducts = [
        { name: "X-Juninho Brutal", qty: 84, revenue: 2931.60, category: "Burgers", percentage: 60 },
        { name: "Combo Double Cheddar", qty: 42, revenue: 1764.00, category: "Combos", percentage: 40 },
        { name: "Batata Suprema", qty: 28, revenue: 784.00, category: "Porções", percentage: 25 },
        { name: "Refrigerante Lata", qty: 65, revenue: 390.00, category: "Bebidas", percentage: 15 },
    ];

    const weeklySales = [
        { day: "Seg", amount: 320, percentage: "h-[30%]" },
        { day: "Ter", amount: 410, percentage: "h-[40%]" },
        { day: "Qua", amount: 380, percentage: "h-[35%]" },
        { day: "Qui", amount: 590, percentage: "h-[55%]" },
        { day: "Sex", amount: 980, percentage: "h-[85%]" },
        { day: "Sáb", amount: 1120, percentage: "h-[100%]" },
        { day: "Dom", amount: 1090, percentage: "h-[95%]" },
    ];

    return (
        <div className="space-y-6">
            {/* Cabeçalho da Aba Principal */}
            <div>
                <h2 className="text-xl font-black text-slate-900">Relatório Financeiro & Desempenho</h2>
                <p className="text-xs text-slate-500 mt-0.5">Analise as métricas de faturamento bruto, canais de pagamento e comportamento de venda da loja.</p>
            </div>

            {/* Menu de Sub-abas interno */}
            <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-400 uppercase tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none">
                <button 
                    onClick={() => setActiveSubTab("faturamento")}
                    className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${activeSubTab === "faturamento" ? "border-slate-900 text-slate-900 font-black" : "border-transparent hover:text-slate-600"}`}
                >
                    <BarChart3 size={14} /> Faturamento & Vendas
                </button>
                <button 
                    onClick={() => setActiveSubTab("produtos")}
                    className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${activeSubTab === "produtos" ? "border-slate-900 text-slate-900 font-black" : "border-transparent hover:text-slate-600"}`}
                >
                    <Utensils size={14} /> Produtos Mais Vendidos
                </button>
                <button 
                    onClick={() => setActiveSubTab("horarios")}
                    className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${activeSubTab === "horarios" ? "border-slate-900 text-slate-900 font-black" : "border-transparent hover:text-slate-600"}`}
                >
                    <Clock size={14} /> Horários e Dias de Pico
                </button>
            </div>

            {/* CONTEÚDO DAS SUB-ABAS */}

            {/* 1. ABA FATURAMENTO & MÉTODOS DE PAGAMENTO */}
            {activeSubTab === "faturamento" && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs relative overflow-hidden">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faturamento Bruto</span>
                            <div className="text-2xl font-black text-slate-900">{metrics.totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                            <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                                <ArrowUpRight size={12} /> +12.4%
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pedidos Concluídos</span>
                            <div className="text-2xl font-black text-slate-900">{metrics.orderCount} ordens</div>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ticket Médio Geral</span>
                            <div className="text-2xl font-black text-slate-900">{metrics.ticketMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                        </div>
                    </div>

                    {/* Divisão por Métodos de Pagamento */}
                    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-3xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><CreditCard size={16} /> Meios de Pagamento mais Utilizados</h3>
                        <div className="space-y-4">
                            {paymentMethods.map((method, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>{method.name} ({method.percentage}%)</span>
                                        <span className="text-slate-900">{method.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${method.color} rounded-full`} style={{ width: `${method.percentage}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. ABA PRODUTOS MAIS VENDIDOS */}
            {activeSubTab === "produtos" && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-3xs overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-900">Ranking de Itens Campeões de Venda</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/40 transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-7 h-7 font-black text-xs text-slate-500 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                        #{idx + 1}
                                    </div>
                                    <div className="w-full">
                                        <div className="flex justify-between text-sm font-bold text-slate-900">
                                            <span>{product.name}</span>
                                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{product.category}</span>
                                        </div>
                                        {/* Barra visual de proporção */}
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5">
                                            <div className="h-full bg-slate-900 rounded-full" style={{ width: `${product.percentage}%` }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex sm:flex-col justify-between items-end text-xs font-bold shrink-0 pl-10 sm:pl-0">
                                    <span className="text-slate-900">{product.qty} unidades vendidas</span>
                                    <span className="text-slate-500 font-semibold">{product.revenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} faturados</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. ABA HORÁRIOS E DIAS DE PICO */}
            {activeSubTab === "horarios" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    {/* Gráfico de Barras em Tailwind - Dias da Semana */}
                    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-3xs md:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Calendar size={16} /> Volume de Vendas por Dia da Semana</h3>
                        <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-l border-slate-100">
                            {weeklySales.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="text-[10px] font-black text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-slate-100 px-1 rounded">
                                        R${data.amount}
                                    </div>
                                    <div className={`w-full ${data.percentage} bg-slate-900 hover:bg-slate-800 rounded-t-md transition-all duration-500`} />
                                    <span className="text-xs font-bold text-slate-500 mt-1">{data.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Concentração de Horários */}
                    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-3xs space-y-4 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Clock size={16} /> Faixa Horária de Pico</h3>
                            <p className="text-xs text-slate-400 mt-1">Seu maior fluxo de pedidos concentrados.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-900 text-white rounded-xl flex justify-between items-center">
                                <span className="text-xs font-black tracking-wide">19:00h às 22:00h</span>
                                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md">Pico Máximo</span>
                            </div>
                            <div className="p-3 bg-slate-50 text-slate-700 border border-slate-100 rounded-xl flex justify-between items-center">
                                <span className="text-xs font-bold">18:00h às 19:00h</span>
                                <span className="text-[10px] font-bold text-slate-400">Médio</span>
                            </div>
                            <div className="p-3 bg-slate-50 text-slate-700 border border-slate-100 rounded-xl flex justify-between items-center">
                                <span className="text-xs font-bold">22:00h às 23:30h</span>
                                <span className="text-[10px] font-bold text-slate-400">Médio</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase text-center">Ideal para ajustar escalas de motoboys</span>
                    </div>
                </div>
            )}
        </div>
    );
}