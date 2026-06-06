"use client";

import { useState } from "react";
import { 
    Store, 
    Plus, 
    Search, 
    ExternalLink, 
    Trash2, 
    X, 
    Sliders, 
    DollarSign, 
    ShoppingBag, 
    Percent, 
    Layers, 
    ShieldAlert
} from "lucide-react";

interface Restaurant {
    id: number;
    name: string;
    slug: string;
    plan: "Trial" | "Basic" | "Pro" | "Enterprise";
    status: "Ativo" | "Suspenso" | "Inativo";
    deliveryFee: number;
    deliveryTime: string;
    totalRevenue: number;
    orderCount: number;
    commissionRate: number; 
    maxProducts: number;    
    createdAt: string;
}

export default function SuperAdminPanel() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([
        { 
            id: 1, 
            name: "Juninho Lanches", 
            slug: "juninho-lanches", 
            plan: "Pro", 
            status: "Ativo",
            deliveryFee: 7.00,
            deliveryTime: "35-45 min",
            totalRevenue: 4890.50,
            orderCount: 142,
            commissionRate: 5.0,
            maxProducts: 150,
            createdAt: "12/03/2026"
        },
        { 
            id: 2, 
            name: "Pizzaria do Zé", 
            slug: "pizzaria-ze", 
            plan: "Basic", 
            status: "Ativo",
            deliveryFee: 5.50,
            deliveryTime: "30-45 min",
            totalRevenue: 1240.00,
            orderCount: 38,
            commissionRate: 7.0,
            maxProducts: 50,
            createdAt: "28/04/2026"
        },
        { 
            id: 3, 
            name: "Sushi House", 
            slug: "sushi-house", 
            plan: "Trial", 
            status: "Suspenso",
            deliveryFee: 10.00,
            deliveryTime: "50-65 min",
            totalRevenue: 0.00,
            orderCount: 0,
            commissionRate: 10.0,
            maxProducts: 25,
            createdAt: "01/06/2026"
        },
    ]);

    const [search, setSearch] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newStoreName, setNewStoreName] = useState("");
    const [selectedStore, setSelectedStore] = useState<Restaurant | null>(null);

    const totalStores = restaurants.length;
    const globalVolume = restaurants.reduce((acc, r) => acc + r.totalRevenue, 0);
    const totalOrders = restaurants.reduce((acc, r) => acc + r.orderCount, 0);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleAddStore = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStoreName.trim()) return;

        const newStore: Restaurant = {
            id: Date.now(),
            name: newStoreName,
            slug: generateSlug(newStoreName),
            plan: "Trial",
            status: "Ativo",
            deliveryFee: 6.00,
            deliveryTime: "40-50 min",
            totalRevenue: 0,
            orderCount: 0,
            commissionRate: 5.0,
            maxProducts: 30,
            createdAt: new Date().toLocaleDateString("pt-BR")
        };

        setRestaurants([...restaurants, newStore]);
        setNewStoreName("");
        setIsAddModalOpen(false);
    };

    const handleSaveAdvancedEdits = (updatedStore: Restaurant) => {
        setRestaurants(restaurants.map(r => r.id === updatedStore.id ? updatedStore : r));
        setSelectedStore(null);
    };

    const handleDeleteStore = (id: number) => {
        if (confirm("Tem certeza absoluta que deseja remover este estabelecimento?")) {
            setRestaurants(restaurants.filter(r => r.id !== id));
            if (selectedStore?.id === id) setSelectedStore(null);
        }
    };

    const filteredRestaurants = restaurants.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase()) || 
        r.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
            
            {/* Header Sincronizado com a Identidade do Sistema */}
            <header className="bg-white border-b border-slate-200 shadow-3xs sticky top-0 z-40 w-full shrink-0">
                <div className="w-full px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">
                            MB
                        </div>
                        <div>
                            <h1 className="text-xs font-bold text-slate-900 leading-none mb-0.5">MenuBuilder Core</h1>
                            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Painel de Controle Central</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Master Admin
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
                
                <div>
                    <h2 className="text-xl font-black text-slate-900">Visão Geral do Ecossistema</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Gerenciamento global de parceiros, auditoria de planos e parametrização de limites operacionais.</p>
                </div>

                {/* Grid de Métricas no Padrão do Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total de Lojas</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">{totalStores} parceiros</div>
                        <Store size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                    </div>
                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Volume Total (GMV)</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">
                            {globalVolume.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </div>
                        <DollarSign size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                    </div>
                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pedidos Consolidados</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">{totalOrders} ordens</div>
                        <ShoppingBag size={40} className="absolute right-2 bottom-2 text-slate-100 pointer-events-none" />
                    </div>
                </div>

                {/* Filtros e Ações */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome ou slug..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-3xs"
                        />
                    </div>
                    
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-black transition-colors shadow-xs cursor-pointer"
                    >
                        <Plus size={14} strokeWidth={3} />
                        CADASTRAR NOVA LOJA
                    </button>
                </div>

                {/* Tabela Customizada */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-400 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="px-6 py-4">Estabelecimento</th>
                                    <th className="px-6 py-4">Link Operacional</th>
                                    <th className="px-6 py-4">Plano</th>
                                    <th className="px-6 py-4">Faturamento Acumulado</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Ações de Gestão</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                                {filteredRestaurants.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-slate-400 font-bold text-xs">
                                            Nenhum estabelecimento encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRestaurants.map((rest) => (
                                        <tr key={rest.id} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-black text-slate-900 text-sm">{rest.name}</div>
                                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Criado em: {rest.createdAt}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                                                    /{rest.slug} <ExternalLink size={11} className="text-slate-400" />
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                                                    {rest.plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                <div>{rest.totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{rest.orderCount} pedidos</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                                                    rest.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                                                    rest.status === 'Suspenso' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {rest.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button 
                                                        onClick={() => setSelectedStore(rest)}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-[11px] font-bold cursor-pointer"
                                                    >
                                                        <Sliders size={13} /> Gerenciar
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteStore(rest.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* MODAL 1: PROVISIONAMENTO */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                            <h3 className="font-black text-slate-900 text-sm tracking-wide uppercase">Provisionar Estabelecimento</h3>
                            <button onClick={() => { setIsAddModalOpen(false); setNewStoreName(""); }} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddStore} className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nome Comercial</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Burger King Unidade Centro"
                                    value={newStoreName}
                                    onChange={(e) => setNewStoreName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                                    required
                                    autoFocus
                                />
                                {newStoreName.trim() && (
                                    <p className="text-[10px] font-semibold text-slate-400 mt-1.5">
                                        Slug da Rota: <span className="font-mono text-slate-900">/{generateSlug(newStoreName)}</span>
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setNewStoreName(""); }} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer">
                                    CRIAR ESTABELECIMENTO
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: EDIÇÃO AVANÇADA (SEM CONTEÚDO DE FORÇAR MÉRICAS) */}
            {selectedStore && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
                        
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                            <div>
                                <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider">Configuração de Parâmetros Avançados</span>
                                <h3 className="font-black text-base mt-0.5">{selectedStore.name}</h3>
                            </div>
                            <button onClick={() => setSelectedStore(null)} className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 transition-colors cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
                            
                            {/* Controle Cadastral */}
                            <div className="space-y-3">
                                <h4 className="font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1 text-[11px] flex items-center gap-1.5">
                                    <ShieldAlert size={14} className="text-slate-500" /> Controle Cadastral & Contrato
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Plano Comercial</label>
                                        <select 
                                            value={selectedStore.plan}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onChange={(e) => setSelectedStore({...selectedStore, plan: e.target.value as any})}
                                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-slate-900"
                                        >
                                            <option value="Trial">Trial (Demonstração)</option>
                                            <option value="Basic">Basic (Inicial)</option>
                                            <option value="Pro">Pro (Completo)</option>
                                            <option value="Enterprise">Enterprise (Escalar)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status de Acesso</label>
                                        <select 
                                            value={selectedStore.status}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onChange={(e) => setSelectedStore({...selectedStore, status: e.target.value as any})}
                                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-slate-900"
                                        >
                                            <option value="Ativo">Ativo / Operando</option>
                                            <option value="Suspenso">Suspenso / Inadimplência</option>
                                            <option value="Inativo">Inativo / Desativado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50 gap-2">
                            <button type="button" onClick={() => setSelectedStore(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleSaveAdvancedEdits(selectedStore)} 
                                className="px-4 py-2 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                            >
                                GRAVAR PARÂMETROS
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}