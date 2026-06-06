// components/tenant/Sidebar.tsx
"use client";

import { ClipboardList, Package, Settings, CreditCard, MapPin, DollarSign, Ticket, History, Users} from "lucide-react";
import { TabType } from "@/types/tenant";

interface SidebarProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    pendingOrdersCount: number;
}

interface MenuItem {
    id: TabType;
    name: string;
    icon: React.ReactNode;
    badge?: number;
}

export default function Sidebar({ activeTab, setActiveTab, pendingOrdersCount }: SidebarProps) {
    const menuItems: MenuItem[] = [
        { id: "pedidos", name: "Pedidos Ativos", icon: <ClipboardList size={18} />, badge: pendingOrdersCount },
        { id: "historico", name: "Histórico de Pedidos", icon: <History size={18} /> },
        { id: "produtos", name: "Produtos & Categorias", icon: <Package size={18} /> },
        { id: "cupons", name: "Cupons de Desconto", icon: <Ticket size={18} /> },
        { id: "clientes", name: "Meus Clientes", icon: <Users size={18} /> }, // <--- Adicionado aqui
        { id: "pagamentos", name: "Formas de Pagamento", icon: <CreditCard size={18} /> },
        { id: "entregas", name: "Regiões de Entrega", icon: <MapPin size={18} /> },
        { id: "financeiro", name: "Relatório Financeiro", icon: <DollarSign size={18} /> },
        { id: "personalizacao", name: "Configurar Loja", icon: <Settings size={18} /> },
    ];

    return (
        <aside className="md:col-span-1 space-y-1">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === item.id
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-200/60"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                    </div>
                    {item.badge && item.badge > 0 ? (
                        <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                            {item.badge}
                        </span>
                    ) : null}
                </button>
            ))}
        </aside>
    );
}