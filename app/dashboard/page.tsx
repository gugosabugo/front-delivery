"use client";

import { useState, useRef } from "react";
import {
    Package, Image as ImageIcon, Plus, Edit2, Trash2, Power,
    Bell, ClipboardList, Settings, Check, X, Clock, DollarSign, Upload, Trash,
    MessageSquare, Printer, CreditCard, MapPin, ChevronRight, User
} from "lucide-react";

// Interfaces completas para tipagem dos dados sincronizados
interface AddOn {
    name: string;
    price: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
    active: boolean;
    addOns: AddOn[];
}

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    selectedAddOns: AddOn[];
    observation?: string;
}

interface Order {
    id: string;
    customer: string;
    phone: string;
    time: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: "Cartão de Crédito" | "Pix" | "Dinheiro (Troco para R$ 100)";
    address: string;
    status: "Recebido" | "Sendo preparado" | "A caminho" | "Entregue";
}

export default function TenantDashboard() {
    const [activeTab, setActiveTab] = useState<"pedidos" | "produtos" | "personalizacao">("pedidos");
    const [isStoreOpen, setIsStoreOpen] = useState(true);

    // Estado do pedido selecionado para detalhamento em Modal/Sidebar lateral
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // --- RECURSOS DE ARQUIVOS (REFS) ---
    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    // --- ESTADOS DA ABA DE PERSONALIZAÇÃO (BRANDS & INFOS) ---
    const [storeName, setStoreName] = useState("Juninho Lanches");
    const [deliveryFee, setDeliveryFee] = useState("7.00");
    const [deliveryTime, setDeliveryTime] = useState("35-45 min");
    const [logoImg, setLogoImg] = useState<string | null>("/image_e06582.png");
    const [bannerImg, setBannerImg] = useState<string | null>("/Banner.png");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'logo') setLogoImg(reader.result as string);
                else setBannerImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- ESTADOS DA ABA DE PEDIDOS COM DETALHES COMPLETOS ---
    const [orders, setOrders] = useState<Order[]>([
        { 
            id: "#1024", 
            customer: "Carlos Henrique", 
            phone: "(14) 99999-1234",
            time: "Há 5 min",
            address: "Rua das Flores, 123 - Apt 42 - Centro",
            paymentMethod: "Pix",
            subtotal: 90.80,
            deliveryFee: 7.00,
            total: 97.80, 
            status: "Recebido", 
            items: [
                {
                    name: "X-Juninho Brutal",
                    quantity: 2,
                    price: 34.90,
                    observation: "Tirar cebola e maionese de um dos lanches. Deixar a carne ao ponto.",
                    selectedAddOns: [{ name: "Bacon Crispy", price: 5.00 }]
                },
                {
                    name: "Batata Suprema",
                    quantity: 1,
                    price: 28.00,
                    observation: "",
                    selectedAddOns: []
                }
            ]
        },
        { 
            id: "#1023", 
            customer: "Mariana Souza", 
            phone: "(14) 98888-5678",
            time: "Há 15 min",
            address: "Av. Paulista, 1500 - Bela Vista",
            paymentMethod: "Cartão de Crédito",
            subtotal: 24.90,
            deliveryFee: 7.00,
            total: 31.90, 
            status: "Sendo preparado", 
            items: [
                {
                    name: "X-Salada Clássico",
                    quantity: 1,
                    price: 24.90,
                    observation: "Caprichar no molho verde da casa.",
                    selectedAddOns: []
                }
            ]
        },
        { 
            id: "#1022", 
            customer: "Lucas Andrade", 
            phone: "(14) 97777-4321",
            time: "Há 30 min",
            address: "Alameda das Nações, 405 - Jd. Europa",
            paymentMethod: "Dinheiro (Troco para R$ 100)",
            subtotal: 42.00,
            deliveryFee: 7.00,
            total: 49.00, 
            status: "A caminho", 
            items: [
                {
                    name: "Combo Double Cheddar",
                    quantity: 1,
                    price: 42.00,
                    observation: "",
                    selectedAddOns: []
                }
            ]
        },
    ]);

    const updateOrderStatus = (id: string, newStatus: Order["status"]) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    };

    const handlePrintOrder = (order: Order) => {
        alert(`Enviando Cupom do pedido ${order.id} para a impressora KDS Termo-Sinal...`);
    };

    // --- ESTADOS DA ABA DE PRODUTOS & CATEGORIAS ---
    const [categories, setCategories] = useState<string[]>(["Burgers", "Combos", "Porções", "Bebidas"]);
    const [newCategory, setNewCategory] = useState("");
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: "X-Juninho Brutal", price: 34.90, category: "Burgers", description: "Dois hambúrgueres artesanais de 150g e muito queijo cheddar bacon crocante.", active: true, addOns: [{ name: "Bacon Crispy", price: 5.00 }] },
        { id: 2, name: "Combo Double Cheddar", price: 42.00, category: "Combos", description: "1 X-Cheddar + Batata Frita + Refrigerante.", active: true, addOns: [] },
    ]);

    const [isProdModalOpen, setIsProdModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [prodForm, setProdForm] = useState({
        name: "", price: "", category: "Burgers", description: "", addOns: [] as AddOn[]
    });

    const openProductModal = (product?: Product) => {
        if (product) {
            setEditingId(product.id);
            setProdForm({
                name: product.name,
                price: product.price.toString(),
                category: product.category,
                description: product.description,
                addOns: product.addOns ? [...product.addOns] : []
            });
        } else {
            setEditingId(null);
            setProdForm({ name: "", price: "", category: "Burgers", description: "", addOns: [] });
        }
        setIsProdModalOpen(true);
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prodForm.name || !prodForm.price) return;

        const targetProduct: Product = {
            id: editingId || Date.now(),
            name: prodForm.name,
            price: parseFloat(prodForm.price),
            category: prodForm.category,
            description: prodForm.description,
            active: true,
            addOns: prodForm.addOns
        };

        if (editingId) {
            setProducts(products.map(p => p.id === editingId ? targetProduct : p));
        } else {
            setProducts([...products, targetProduct]);
        }
        setIsProdModalOpen(false);
    };

    const handleDeleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim() || categories.includes(newCategory.trim())) return;
        setCategories([...categories, newCategory.trim()]);
        setNewCategory("");
    };

    const addAddOnField = () => {
        setProdForm({ ...prodForm, addOns: [...prodForm.addOns, { name: "", price: 0 }] });
    };

    const updateAddOnField = (index: number, field: keyof AddOn, value: string | number) => {
        const updated = [...prodForm.addOns];
        updated[index] = { ...updated[index], [field]: field === 'price' ? parseFloat(value as string) || 0 : value };
        setProdForm({ ...prodForm, addOns: updated });
    };

    const removeAddOnField = (index: number) => {
        setProdForm({ ...prodForm, addOns: prodForm.addOns.filter((_, i) => i !== index) });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">

            {/* TOPBAR */}
            <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {logoImg ? (
                            <img src={logoImg} className="w-10 h-10 rounded-xl object-cover border border-slate-200" alt="Logo" />
                        ) : (
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">JL</div>
                        )}
                        <div>
                            <h1 className="text-sm font-bold text-slate-900">{storeName}</h1>
                            <p className="text-xs text-slate-400 font-medium">Painel União de Gestão</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsStoreOpen(!isStoreOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isStoreOpen
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                        >
                            <Power size={14} />
                            {isStoreOpen ? "Loja Aberta" : "Loja Fechada"}
                        </button>
                    </div>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* NAVEGAÇÃO LATERAL */}
                <aside className="md:col-span-1 space-y-1">
                    <button
                        onClick={() => setActiveTab("pedidos")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "pedidos" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/60"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <ClipboardList size={18} />
                            <span>Pedidos</span>
                        </div>
                        {orders.filter(o => o.status === "Recebido").length > 0 && (
                            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                                {orders.filter(o => o.status === "Recebido").length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("produtos")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "produtos" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/60"
                            }`}
                    >
                        <Package size={18} />
                        Produtos & Categorias
                    </button>

                    <button
                        onClick={() => setActiveTab("personalizacao")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "personalizacao" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/60"
                            }`}
                    >
                        <Settings size={18} />
                        Configurar Loja
                    </button>
                </aside>

                {/* ÁREA DE CONTEÚDO DINÂMICO */}
                <div className="md:col-span-3 space-y-6">

                    {/* ABA 1: GERENCIAMENTO DE PEDIDOS */}
                    {activeTab === "pedidos" && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Gestor de Pedidos</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Clique em um pedido para ver detalhes de entrega, observações e emitir o KDS.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {orders.map((order) => (
                                    <div 
                                        key={order.id} 
                                        className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col transition-all border-l-4 border-l-slate-300"
                                        style={{ borderLeftColor: order.status === "Recebido" ? '#dc2626' : order.status === "Sendo preparado" ? '#eab308' : order.status === "A caminho" ? '#10b981' : '#cbd5e1' }}
                                    >
                                        <div 
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                        >
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-slate-900 text-sm">{order.id} - {order.customer}</span>
                                                    <span className="text-xs text-slate-400 font-medium">• {order.time}</span>
                                                </div>
                                                
                                                {/* Visualização Simplificada dos Itens na lista */}
                                                <p className="text-xs text-slate-600 font-medium line-clamp-1">
                                                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                                                </p>

                                                {/* Indicação visual de que há observações no pedido */}
                                                {order.items.some(i => i.observation) && (
                                                    <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                                        <MessageSquare size={10} /> Contém Observação
                                                    </div>
                                                )}

                                                <div className="text-xs font-black text-slate-900 pt-1">
                                                    Total: {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                {/* Badge de Status Atual (Sequência Definitiva) */}
                                                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
                                                    order.status === "Recebido" ? "bg-red-50 text-red-700 border-red-200" :
                                                    order.status === "Sendo preparado" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                                    order.status === "A caminho" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}>
                                                    {order.status}
                                                </span>

                                                {/* Controle de Fluxo Lateral */}
                                                <div className="flex gap-1">
                                                    {order.status === "Recebido" && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, "Sendo preparado")}
                                                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-black rounded-xl hover:bg-red-700 transition-colors shadow-xs"
                                                        >
                                                            Iniciar Preparo
                                                        </button>
                                                    )}
                                                    {order.status === "Sendo preparado" && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, "A caminho")}
                                                            className="px-3 py-1.5 bg-yellow-500 text-slate-900 text-xs font-black rounded-xl hover:bg-yellow-600 transition-colors shadow-xs"
                                                        >
                                                            Despachar
                                                        </button>
                                                    )}
                                                    {order.status === "A caminho" && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, "Entregue")}
                                                            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-colors shadow-xs"
                                                        >
                                                            Entregue
                                                        </button>
                                                    )}
                                                    {order.status === "Entregue" && (
                                                        <span className="text-slate-400 bg-slate-50 p-1.5 rounded-xl border border-slate-200 flex items-center justify-center" title="Finalizado">
                                                            <Check size={16} strokeWidth={3} />
                                                        </span>
                                                    )}

                                                    <button 
                                                        onClick={() => handlePrintOrder(order)}
                                                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                                                        title="Imprimir Cupom / KDS"
                                                    >
                                                        <Printer size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ABA 2: PRODUTOS E CATEGORIAS */}
                    {activeTab === "produtos" && (
                        <div className="space-y-6">
                            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
                                <h3 className="text-sm font-bold text-slate-900">Suas Categorias</h3>
                                <form onSubmit={handleAddCategory} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nova Categoria (Ex: Sobremesas)"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
                                    />
                                    <button type="submit" className="bg-slate-950 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-slate-800">
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
                                    <button onClick={() => openProductModal()} className="flex items-center gap-1 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800">
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
                                                        {prod.addOns?.length > 0 && ` (${prod.addOns.length} adicionais)`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openProductModal(prod)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABA 3: CONFIGURAR LOJA */}
                    {activeTab === "personalizacao" && (
                        <div className="space-y-6">
                            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
                                <h3 className="text-sm font-bold text-slate-900">Identidade Visual</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Foto de Capa (Banner)</label>
                                        <div
                                            onClick={() => bannerInputRef.current?.click()}
                                            className="h-32 bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden cursor-pointer relative group flex items-center justify-center"
                                        >
                                            {bannerImg ? (
                                                <img src={bannerImg} alt="Banner Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-slate-400 flex flex-col items-center gap-1 text-xs"><Upload size={18} />Clique para upar</div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">Alterar Capa</div>
                                        </div>
                                        <input type="file" ref={bannerInputRef} accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'banner')} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Logo (Perfil)</label>
                                        <div
                                            onClick={() => logoInputRef.current?.click()}
                                            className="h-32 w-32 mx-auto md:mx-0 bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden cursor-pointer relative group flex items-center justify-center"
                                        >
                                            {logoImg ? (
                                                <img src={logoImg} alt="Logo Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-slate-400 flex flex-col items-center gap-1 text-xs"><Upload size={18} />Upar Logo</div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-2">Alterar Logo</div>
                                        </div>
                                        <input type="file" ref={logoInputRef} accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'logo')} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-6">
                                <h3 className="text-sm font-bold text-slate-900">Configurações Gerais</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nome Fantasia</label>
                                        <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Taxa de Entrega Padrão</label>
                                        <input type="text" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tempo de Entrega Estimado</label>
                                        <input type="text" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 flex justify-end">
                                    <button onClick={() => alert("Alterações salvas!")} className="bg-slate-950 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800">
                                        Salvar Alterações
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* MODAL / SLIDEOUT DE DETALHES DO PEDIDO COMPLETO (MÉTODO DE PAGAMENTO, OBSERVAÇÕES, IMPRESSÃO) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex justify-end backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 overflow-hidden">
                        
                        {/* Header do Detalhe */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ClipboardList size={18} className="text-slate-600" />
                                <div>
                                    <h3 className="font-black text-sm text-slate-900">Detalhes do Pedido {selectedOrder.id}</h3>
                                    <span className="text-[10px] text-slate-400 font-medium font-mono">{selectedOrder.time}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                        </div>

                        {/* Conteúdo Rolável */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
                            
                            {/* Bloco Cliente */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <User size={13} /> Dados do Cliente
                                </div>
                                <div className="font-bold text-slate-800 text-sm">{selectedOrder.customer}</div>
                                <div className="text-slate-500 font-medium">{selectedOrder.phone}</div>
                            </div>

                            {/* Bloco Endereço de Entrega */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <MapPin size={13} /> Endereço de Entrega
                                </div>
                                <p className="text-slate-700 font-medium leading-relaxed">{selectedOrder.address}</p>
                            </div>

                            {/* Bloco Forma de Pagamento */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <CreditCard size={13} /> Forma de Pagamento
                                </div>
                                <span className="inline-block bg-slate-200/60 text-slate-800 px-2 py-1 rounded-md font-bold">
                                    {selectedOrder.paymentMethod}
                                </span>
                            </div>

                            {/* Listagem Estruturada de Itens, Adicionais e Observações */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Itens Solicitados</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="border border-slate-100 rounded-xl p-3 space-y-2 bg-white shadow-xs">
                                            <div className="flex justify-between font-bold text-slate-900">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>{(item.price * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                            </div>

                                            {/* Adicionais selecionados */}
                                            {item.selectedAddOns.length > 0 && (
                                                <div className="pl-3 border-l-2 border-slate-200 text-slate-500 text-[11px] font-medium space-y-0.5">
                                                    {item.selectedAddOns.map((addon, aIdx) => (
                                                        <p key={aIdx}>+ {addon.name} (+ R$ {addon.price.toFixed(2)})</p>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Observações Destacadas em Vermelho conforme solicitado */}
                                            {item.observation && (
                                                <div className="bg-red-50/70 border border-red-100 text-red-900 rounded-xl p-3 flex items-start gap-2 mt-1">
                                                    <MessageSquare size={13} className="text-red-500 shrink-0 mt-0.5" />
                                                    <div className="space-y-0.5">
                                                        <span className="block text-[9px] font-black uppercase tracking-wider text-red-600">Observação Importante:</span>
                                                        <p className="font-medium leading-relaxed">{item.observation}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Detalhamento de Valores */}
                            <div className="border-t border-slate-200 pt-4 space-y-2 font-medium text-slate-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{selectedOrder.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxa de Entrega</span>
                                    <span>{selectedOrder.deliveryFee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-dashed pt-2">
                                    <span>Total Geral</span>
                                    <span>{selectedOrder.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Fixo com Ações e Alteração de Status */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2 shrink-0">
                            <button 
                                onClick={() => handlePrintOrder(selectedOrder)}
                                className="w-full bg-slate-900 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-xs"
                            >
                                <Printer size={16} /> Imprimir Cupom KDS
                            </button>

                            <div className="flex gap-2">
                                {selectedOrder.status === "Recebido" && (
                                    <button 
                                        onClick={() => updateOrderStatus(selectedOrder.id, "Sendo preparado")}
                                        className="flex-1 bg-red-600 text-white text-xs font-black h-11 rounded-xl hover:bg-red-700 transition-colors"
                                    >
                                        Aprovar e Iniciar Preparo
                                    </button>
                                )}
                                {selectedOrder.status === "Sendo preparado" && (
                                    <button 
                                        onClick={() => updateOrderStatus(selectedOrder.id, "A caminho")}
                                        className="flex-1 bg-yellow-500 text-slate-900 text-xs font-black h-11 rounded-xl hover:bg-yellow-600 transition-colors"
                                    >
                                        Despachar para Entrega
                                    </button>
                                )}
                                {selectedOrder.status === "A caminho" && (
                                    <button 
                                        onClick={() => updateOrderStatus(selectedOrder.id, "Entregue")}
                                        className="flex-1 bg-emerald-600 text-white text-xs font-black h-11 rounded-xl hover:bg-emerald-700 transition-colors"
                                    >
                                        Confirmar como Entregue
                                    </button>
                                )}
                                {selectedOrder.status === "Entregue" && (
                                    <div className="flex-1 bg-slate-200 text-slate-500 text-xs font-bold h-11 rounded-xl flex items-center justify-center gap-1.5 border border-slate-300">
                                        <Check size={14} strokeWidth={3} /> Pedido Finalizado
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* MODAL COMPLEXO DE PRODUTO + INPUTS DE ADICIONAIS */}
            {isProdModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
                    <form onSubmit={handleSaveProduct} className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <h3 className="font-bold text-sm text-slate-900">
                                {editingId ? "Editar Informações do Item" : "Adicionar Novo Produto"}
                            </h3>
                            <button type="button" onClick={() => setIsProdModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                        </div>

                        <div className="p-4 space-y-4 text-sm overflow-y-auto flex-1">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome do Item</label>
                                <input required type="text" value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" placeholder="Ex: Burger Clássico" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preço Base (R$)</label>
                                    <input required type="number" step="0.01" value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" placeholder="29.90" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Categoria</label>
                                    <select value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white">
                                        {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descrição / Ingredientes</label>
                                <textarea value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs h-16 resize-none" placeholder="Pão, carne, queijo..." />
                            </div>

                            {/* GESTOR INTERNO DE COMPONENTES ADICIONAIS */}
                            <div className="border-t border-slate-100 pt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-[10px] font-bold text-slate-600 uppercase">Adicionais Opcionais (Extras)</label>
                                    <button type="button" onClick={addAddOnField} className="text-[10px] bg-slate-900 text-white font-bold px-2 py-1 rounded-md flex items-center gap-0.5 hover:bg-slate-800">
                                        <Plus size={12} /> Incluir Extra
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {prodForm.addOns.map((addOn, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Ex: Queijo Cheddar"
                                                value={addOn.name}
                                                onChange={(e) => updateAddOnField(index, 'name', e.target.value)}
                                                className="flex-1 p-1.5 border border-slate-200 rounded-lg text-xs"
                                                required
                                            />
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Preço"
                                                value={addOn.price || ""}
                                                onChange={(e) => updateAddOnField(index, 'price', e.target.value)}
                                                className="w-20 p-1.5 border border-slate-200 rounded-lg text-xs"
                                                required
                                            />
                                            <button type="button" onClick={() => removeAddOnField(index)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {prodForm.addOns.length === 0 && (
                                        <p className="text-[10px] text-slate-400 italic py-1">Nenhum opcional adicionado a este item.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
                            <button type="button" onClick={() => setIsProdModalOpen(false)} className="px-3 py-1.5 text-slate-500">Cancelar</button>
                            <button type="submit" className="px-4 py-1.5 bg-slate-950 text-white rounded-lg">
                                {editingId ? "Salvar Modificações" : "Adicionar Produto"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
}