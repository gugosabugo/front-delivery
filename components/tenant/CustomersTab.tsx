"use client";

import { useState } from "react";
import { Search, Users, MessageSquare } from "lucide-react";
import { Order } from "@/types/tenant";

interface CustomersTabProps {
    orders: Order[];
}

interface Customer {
    name: string;
    phone: string;
    totalOrders: number;
}

export default function CustomersTab({ orders }: CustomersTabProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Extrai clientes únicos com base no histórico de pedidos do sistema
    const customerMap = new Map<string, Customer>();

    orders.forEach(order => {
        const cleanPhone = order.phone.trim();
        if (customerMap.has(cleanPhone)) {
            const existing = customerMap.get(cleanPhone)!;
            existing.totalOrders += 1;
        } else {
            customerMap.set(cleanPhone, {
                name: order.customer,
                phone: cleanPhone,
                totalOrders: 1
            });
        }
    });

    const uniqueCustomers = Array.from(customerMap.values());

    // Filtra os clientes com base na busca por nome ou número
    const filteredCustomers = uniqueCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.replace(/\D/g, "").includes(searchTerm.replace(/\D/g, ""))
    );

    const handleWhatsAppClick = (phone: string) => {
        const cleanNumber = phone.replace(/\D/g, "");
        window.open(`https://wa.me/55${cleanNumber}`, "_blank");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-slate-900">Base de Clientes</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Visualize e entre em contato com as pessoas que já compraram na sua loja.</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome ou celular..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 font-semibold"
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Nome Completo</th>
                                <th className="px-6 py-4">Número de Celular</th>
                                <th className="px-6 py-4 text-center">Total de Pedidos</th>
                                <th className="px-6 py-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 text-slate-700 font-bold rounded-lg flex items-center justify-center text-xs">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-slate-900">{customer.name}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-600">
                                            {customer.phone}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700">
                                            {customer.totalOrders} {customer.totalOrders === 1 ? 'pedido' : 'pedidos'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleWhatsAppClick(customer.phone)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-200/50 cursor-pointer"
                                            >
                                                <MessageSquare size={14} /> Conversar
                                            </button>
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