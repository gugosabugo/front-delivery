"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Product, AddOn } from "@/types/tenant";

interface ProductFormModalProps {
    editingProduct: Product | null;
    categories: string[];
    onClose: () => void;
    onSave: (product: Omit<Product, "active">) => void;
}

export default function ProductFormModal({ editingProduct, categories, onClose, onSave }: ProductFormModalProps) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [addOns, setAddOns] = useState<AddOn[]>([]);

    useEffect(() => {
        if (editingProduct) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(editingProduct.name);
            setPrice(editingProduct.price.toString());
            setCategory(editingProduct.category);
            setDescription(editingProduct.description);
            setAddOns(editingProduct.addOns || []);
        } else {
            setName("");
            setPrice("");
            setCategory(categories[0] || "");
            setDescription("");
            setAddOns([]);
        }
    }, [editingProduct, categories]);

    const handleAddAddOn = () => setAddOns([...addOns, { name: "", price: 0 }]);
    
    const handleUpdateAddOn = (index: number, field: keyof AddOn, value: string | number) => {
        const updated = [...addOns];
        updated[index] = { ...updated[index], [field]: field === 'price' ? parseFloat(value as string) || 0 : value };
        setAddOns(updated);
    };

    const handleRemoveAddOn = (index: number) => setAddOns(addOns.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price) return;
        onSave({
            id: editingProduct?.id || Date.now(),
            name,
            price: parseFloat(price),
            category,
            description,
            addOns
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">{editingProduct ? "Editar Informações do Item" : "Adicionar Novo Produto"}</h3>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18} /></button>
                </div>

                <div className="p-4 space-y-4 text-sm overflow-y-auto flex-1">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome do Item</label>
                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preço Base (R$)</label>
                            <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Categoria</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white">
                                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descrição / Ingredientes</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs h-16 resize-none" />
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-[10px] font-bold text-slate-600 uppercase">Adicionais Opcionais (Extras)</label>
                            <button type="button" onClick={handleAddAddOn} className="text-[10px] bg-slate-900 text-white font-bold px-2 py-1 rounded-md flex items-center gap-0.5 hover:bg-slate-800 cursor-pointer"><Plus size={12} /> Incluir Extra</button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {addOns.map((addOn, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" placeholder="Ex: Queijo Cheddar" value={addOn.name} onChange={(e) => handleUpdateAddOn(index, 'name', e.target.value)} className="flex-1 p-1.5 border border-slate-200 rounded-lg text-xs" required />
                                    <input type="number" step="0.01" placeholder="Preço" value={addOn.price || ""} onChange={(e) => handleUpdateAddOn(index, 'price', e.target.value)} className="w-20 p-1.5 border border-slate-200 rounded-lg text-xs" required />
                                    <button type="button" onClick={() => handleRemoveAddOn(index)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 cursor-pointer"><Trash2 size={14} /></button>
                                </div>
                            ))}
                            {addOns.length === 0 && <p className="text-[10px] text-slate-400 italic py-1">Nenhum opcional adicionado a este item.</p>}
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
                    <button type="button" onClick={onClose} className="px-3 py-1.5 text-slate-500 cursor-pointer">Cancelar</button>
                    <button type="submit" className="px-4 py-1.5 bg-slate-950 text-white rounded-lg cursor-pointer">Salvar Produto</button>
                </div>
            </form>
        </div>
    );
}