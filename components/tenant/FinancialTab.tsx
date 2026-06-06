"use client";

import { DollarSign, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

export default function FinancialTab() {
    // Dados simulados expandidos
    const metrics = { 
        totalRevenue: 4890.50, 
        costs: 2150.00,
        netProfit: 2740.50,
        orderCount: 142, 
        ticketMedio: 34.44 
    };

    // Dados para o gráfico de faturamento da semana
    const weeklyData = [
        { name: "Seg", faturamento: 450 },
        { name: "Ter", faturamento: 520 },
        { name: "Qua", faturamento: 680 },
        { name: "Qui", faturamento: 840 },
        { name: "Sex", faturamento: 1250 },
        { name: "Sáb", faturamento: 1890 },
        { name: "Dom", faturamento: 1560 },
    ];

    // Dados para o gráfico de categorias mais vendidas
    const categoryData = [
        { name: "Hambúrgueres", vendas: 85 },
        { name: "Bebidas", vendas: 120 },
        { name: "Sobremesas", vendas: 45 },
        { name: "Porções", vendas: 60 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-slate-900">Dashboard Financeiro</h2>
                <p className="text-xs text-slate-500 mt-0.5">Acompanhe o fluxo de caixa, custos e desempenho das vendas do restaurante.</p>
            </div>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Faturamento */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faturamento Bruto</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{metrics.totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                    <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-2"><ArrowUpRight size={12} /> +12.4%</div>
                    <DollarSign size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                </div>

                {/* Custos */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Custos Operacionais</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{metrics.costs.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                    <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md mt-2"><ArrowDownRight size={12} /> -3.2%</div>
                    <Wallet size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                </div>

                {/* Pedidos */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pedidos Concluídos</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{metrics.orderCount}</div>
                    <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-2"><ArrowUpRight size={12} /> +8 ordens</div>
                    <ShoppingBag size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                </div>

                {/* Ticket Médio */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ticket Médio Geral</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{metrics.ticketMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                    <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md mt-2">Estável</div>
                    <TrendingUp size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                </div>
            </div>

            {/* Seção de Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Faturamento */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">Faturamento Diário (Últimos 7 dias)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `R$${value}`} />
                                <Tooltip 
                                    formatter={(value) => [`R$ ${value}`, 'Faturamento']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="faturamento" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Categorias */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">Itens Mais Vendidos por Categoria</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }} />
                                <Tooltip 
                                    formatter={(value) => [`${value} itens`, 'Vendas']}
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="vendas" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}