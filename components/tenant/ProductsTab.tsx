"use client";

import { Plus, Image as ImageIcon, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/tenant";

interface ProductsTabProps {
    products: Product[];
    categories: string[];
    onAddCategory: (category: string) => void;
    onOpenModal: (product?: Product) => void;
    onDeleteProduct: (id: number) => void;
}

export default function ProductsTab({ products, categories, onAddCategory, onOpenModal, onDeleteProduct }: ProductsTabProps) {
    const [newCat, setNewCat] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCat.trim()) return;
        onAddCategory(newCat.trim());
        setNewCat("");
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Suas Categorias</h3>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Nova Categoria (Ex: Sobremesas)"
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
                    />
                    <button type="submit" className="bg-slate-950 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer">
                        Adicionar
                    </button>
                </form>
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {categories.map((cat, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200/60">
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900">Listagem de Itens</h3>
                    <button onClick={() => onOpenModal()} className="flex items-center gap-1 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer">
                        <Plus size={14} /> Novo Produto
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {products.map((prod) => (
                        <div key={prod.id} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 border-dashed">
                                    <ImageIcon size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{prod.name}</h4>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {prod.category} • {prod.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        {prod.addOns?.length > 0 ? ` (${prod.addOns.length} adicionais)` : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => onOpenModal(prod)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => onDeleteProduct(prod.id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}