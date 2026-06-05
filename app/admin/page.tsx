"use client";

import { useState } from "react";
import { Store, Plus, Search, Settings, ExternalLink, Trash2, Edit2, X, Check } from "lucide-react";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  plan: string;
  status: "Ativo" | "Inativo";
}

export default function SuperAdminPanel() {
  // Estado inicial dos estabelecimentos que utilizam o serviço
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    { id: 1, name: "Juninho Lanches", slug: "juninho-lanches", plan: "Pro", status: "Ativo" },
    { id: 2, name: "Pizzaria do Zé", slug: "pizzaria-ze", plan: "Basic", status: "Ativo" },
    { id: 3, name: "Sushi House", slug: "sushi-house", plan: "Trial", status: "Inativo" },
  ]);

  const [search, setSearch] = useState("");
  
  // Estados para controle dos Modais / Formulários
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // Função auxiliar para gerar o slug automaticamente a partir do nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // 1. ADICIONAR NOVA LOJA
  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    const newStore: Restaurant = {
      id: Date.now(), // ID temporário baseado no timestamp
      name: newStoreName,
      slug: generateSlug(newStoreName),
      plan: "Trial",
      status: "Ativo"
    };

    setRestaurants([...restaurants, newStore]);
    setNewStoreName("");
    setIsAddModalOpen(false);
  };

  // 2. EDITAR NOME DA LOJA
  const startEditing = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setEditingName(restaurant.name);
  };

  const handleSaveEdit = (id: number) => {
    if (!editingName.trim()) return;

    setRestaurants(restaurants.map(r => 
      r.id === id 
        ? { ...r, name: editingName, slug: generateSlug(editingName) } 
        : r
    ));
    setEditingId(null);
    setEditingName("");
  };

  // 3. EXCLUIR LOJA
  const handleDeleteStore = (id: number) => {
    if (confirm("Tem certeza que deseja remover este estabelecimento do sistema?")) {
      setRestaurants(restaurants.filter(r => r.id !== id));
    }
  };

  // Filtro de busca na tabela
  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Topbar do Admin */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 lg:px-8 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <Store className="text-indigo-400" size={22} />
          <span className="text-lg font-black tracking-tight">
            MenuBuilder<span className="text-indigo-400">.io</span>
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded ml-2 font-mono">
            SUPER_ADMIN
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-300">Painel Geral</span>
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
            AD
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 lg:p-8">
        
        {/* Título e Contador */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Estabelecimentos Cadastrados</h1>
          <p className="text-sm text-slate-500 mt-1">
            Você está gerenciando <span className="font-bold text-slate-700">{restaurants.length}</span> lojas no total.
          </p>
        </div>

        {/* Barra de Ações: Busca e Botão de Adicionar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou link..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <Plus size={16} strokeWidth={2.5} />
            Nova Loja
          </button>
        </div>

        {/* Tabela de Lojas */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Nome da Loja</th>
                  <th className="px-6 py-4">Link do Cardápio (Slug)</th>
                  <th className="px-6 py-4">Plano</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRestaurants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 font-medium">
                      Nenhuma loja encontrada com os termos digitados.
                    </td>
                  </tr>
                ) : (
                  filteredRestaurants.map((rest) => (
                    <tr key={rest.id} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* Nome da Loja (ou Input de Edição Inline) */}
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {editingId === rest.id ? (
                          <div className="flex items-center gap-2 max-w-xs">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="px-2 py-1 text-sm bg-white border border-indigo-400 rounded focus:outline-none w-full font-medium"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleSaveEdit(rest.id)}
                              className="p-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors"
                              title="Salvar"
                            >
                              <Check size={16} strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1 bg-slate-100 text-slate-500 rounded hover:bg-slate-200 transition-colors"
                              title="Cancelar"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span>{rest.name}</span>
                        )}
                      </td>

                      {/* Link da Loja */}
                      <td className="px-6 py-4 font-medium text-indigo-600">
                        <span className="inline-flex items-center gap-1 hover:underline cursor-pointer">
                          /{rest.slug} <ExternalLink size={13} />
                        </span>
                      </td>

                      {/* Plano */}
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-xs font-bold border border-slate-200/60">
                          {rest.plan}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          rest.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {rest.status}
                        </span>
                      </td>

                      {/* Ações: Editar e Excluir */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {editingId !== rest.id && (
                            <button 
                              onClick={() => startEditing(rest)}
                              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Editar Nome"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteStore(rest.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir Loja"
                          >
                            <Trash2 size={16} />
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

      {/* MODAL / OVERLAY PARA ADICIONAR NOVA LOJA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-900">Cadastrar Nova Loja</h3>
              <button 
                onClick={() => { setIsAddModalOpen(false); setNewStoreName(""); }}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddStore} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nome do Estabelecimento
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Juninho Lanches, Burger Express..."
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                  autoFocus
                />
                {newStoreName.trim() && (
                  <p className="text-xs text-slate-400 mt-2">
                    Link gerado: <span className="font-mono font-medium text-indigo-600">/{generateSlug(newStoreName)}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setNewStoreName(""); }}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
                >
                  Criar Loja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}