// components/tenant/OrderHistoryTab.tsx
"use client";

import { Order } from "@/types/tenant";
import { Search, Filter } from "lucide-react";

interface OrderHistoryTabProps {
    orders: Order[];
}

export default function OrderHistoryTab({ orders }: OrderHistoryTabProps) {
    // Filtra apenas pedidos finalizados (Entregue ou Cancelado)
    const historyOrders = orders.filter(o => o.status === "Entregue" || o.status === "Cancelado");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-slate-900">Histórico de Pedidos</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Consulte todos os pedidos finalizados e cancelados.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar por cliente ou ID..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"
                        />
                    </div>
                    <button className="bg-white border border-slate-200 p-2 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">ID / Data</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Pagamento</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {historyOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                                        Nenhum pedido no histórico ainda.
                                    </td>
                                </tr>
                            ) : (
                                historyOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{order.id}</div>
                                            <div className="text-[11px] text-slate-400">{order.time}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">{order.customer}</td>
                                        <td className="px-6 py-4 text-slate-600">{order.paymentMethod}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                                            {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                order.status === 'Entregue' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}