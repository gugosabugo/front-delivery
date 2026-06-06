"use client";

import { useState } from "react";
import { Order, Product, Coupon, TabType } from "@/types/tenant";

// Importação dos Componentes Modulares
import Topbar from "@/components/tenant/Topbar";
import Sidebar from "@/components/tenant/Sidebar";
import OrdersTab from "@/components/tenant/OrdersTab";
import OrderDetailsModal from "@/components/tenant/OrderDetailsModal";
import ProductsTab from "@/components/tenant/ProductsTab";
import ProductFormModal from "@/components/tenant/ProductFormModal";
import SettingsTab from "@/components/tenant/SettingsTab";
import PaymentMethodsTab from "@/components/tenant/PaymentMethodsTab";
import DeliveryAreasTab from "@/components/tenant/DeliveryAreasTab";
import FinancialTab from "@/components/tenant/FinancialTab";
import OrderHistoryTab from "@/components/tenant/OrderHistoryTab";
import CouponsTab from "@/components/tenant/CouponsTab";
import CustomersTab from "@/components/tenant/CustomersTab";

export default function TenantDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>("pedidos");
    const [isStoreOpen, setIsStoreOpen] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isProdModalOpen, setIsProdModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Configurações Gerais da Loja
    const [storeName, setStoreName] = useState("Juninho Lanches");
    const [deliveryFee, setDeliveryFee] = useState("7.00");
    const [deliveryTime, setDeliveryTime] = useState("35-45 min");
    const [logoImg, setLogoImg] = useState<string | null>("/image_e06582.png");
    const [bannerImg, setBannerImg] = useState<string | null>("/Banner.png");

    // Banco de Dados Mockado
    const [categories, setCategories] = useState<string[]>(["Burgers", "Combos", "Porções", "Bebidas"]);
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: "X-Juninho Brutal", price: 34.90, category: "Burgers", description: "Dois hambúrgueres artesanais de 150g e muito queijo cheddar bacon crocante.", active: true, addOns: [{ name: "Bacon Crispy", price: 5.00 }] },
        { id: 2, name: "Combo Double Cheddar", price: 42.00, category: "Combos", description: "1 X-Cheddar + Batata Frita + Refrigerante.", active: true, addOns: [] },
    ]);

    const [coupons, setCoupons] = useState<Coupon[]>([
        { id: "1", code: "BEMVINDO10", type: "percentage", value: 10, active: true, usedCount: 42 },
        { id: "2", code: "FRETEGRATIS", type: "fixed", value: 7, active: false, usedCount: 156 },
    ]);

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
                { name: "X-Juninho Brutal", quantity: 2, price: 34.90, observation: "Tirar cebola e maionese de um dos lanches.", selectedAddOns: [{ name: "Bacon Crispy", price: 5.00 }] },
                { name: "Batata Suprema", quantity: 1, price: 28.00, selectedAddOns: [] }
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
            items: [{ name: "X-Salada Clássico", quantity: 1, price: 24.90, selectedAddOns: [] }]
        },
        // Dados simulados adicionais para povoar o Histórico de Pedidos
        {
            id: "#1022",
            customer: "Ricardo Oliveira",
            phone: "(14) 97777-4321",
            time: "Ontem, 21:40",
            address: "Rua Alagoas, 450",
            paymentMethod: "Pix",
            subtotal: 34.90,
            deliveryFee: 7.00,
            total: 41.90,
            status: "Entregue",
            items: [{ name: "X-Juninho Brutal", quantity: 1, price: 34.90, selectedAddOns: [] }]
        },
        {
            id: "#1021",
            customer: "Beatriz Santos",
            phone: "(14) 96666-8765",
            time: "Ontem, 20:15",
            address: "Av. Rio Branco, 12",
            paymentMethod: "Dinheiro",
            subtotal: 42.00,
            deliveryFee: 7.00,
            total: 49.00,
            status: "Cancelado",
            items: [{ name: "Combo Double Cheddar", quantity: 1, price: 42.00, selectedAddOns: [] }]
        }
    ]);

    const updateOrderStatus = (id: string, newStatus: Order["status"]) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const handlePrintOrder = (order: Order) => {
        alert(`Enviando Cupom do pedido ${order.id} para a impressora KDS...`);
    };

    const handleOpenProductModal = (product?: Product) => {
        setEditingProduct(product || null);
        setIsProdModalOpen(true);
    };

    const handleSaveProduct = (formData: Omit<Product, "active">) => {
        if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
        } else {
            setProducts(prev => [...prev, { ...formData, active: true }]);
        }
        setIsProdModalOpen(false);
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased overflow-hidden">
            {/* Topbar fluida */}
            <Topbar storeName={storeName} logoImg={logoImg} isStoreOpen={isStoreOpen} setIsStoreOpen={setIsStoreOpen} />

            {/* Layout Web focado em preenchimento de tela */}
            <div className="flex-1 flex flex-row overflow-hidden">
                {/* Lateral com largura fixa ideal para Desktop */}
                <div className="w-64 bg-white border-r border-slate-200/80 p-4 shrink-0 h-full overflow-y-auto">
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        pendingOrdersCount={orders.filter(o => o.status === "Recebido").length}
                    />
                </div>

                {/* Área de Conteúdo Principal Ultra Responsiva para Web */}
                <main className="flex-1 bg-slate-50 p-6 overflow-y-auto min-w-0">
                    <div className="w-full max-w-[1600px] mx-auto h-full">
                        {activeTab === "pedidos" && (
                            <OrdersTab orders={orders} onSelectOrder={setSelectedOrder} onUpdateStatus={updateOrderStatus} onPrint={handlePrintOrder} />
                        )}

                        {activeTab === "historico" && (
                            <OrderHistoryTab orders={orders} />
                        )}

                        {activeTab === "produtos" && (
                            <ProductsTab
                                products={products}
                                categories={categories}
                                onAddCategory={(cat) => setCategories([...categories, cat])}
                                onOpenModal={handleOpenProductModal}
                                onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
                            />
                        )}

                        {activeTab === "cupons" && (
                            <CouponsTab
                                coupons={coupons}
                                setCoupons={setCoupons} />
                        )}

                        {activeTab === "clientes" && (
                            <CustomersTab orders={orders} />
                        )}

                        {activeTab === "pagamentos" && <PaymentMethodsTab />}

                        {activeTab === "entregas" && <DeliveryAreasTab />}

                        {activeTab === "financeiro" && <FinancialTab />}

                        {activeTab === "personalizacao" && (
                            <SettingsTab
                                storeName={storeName} setStoreName={setStoreName}
                                deliveryFee={deliveryFee} setDeliveryFee={setDeliveryFee}
                                deliveryTime={deliveryTime} setDeliveryTime={setDeliveryTime}
                                logoImg={logoImg} setLogoImg={setLogoImg}
                                bannerImg={bannerImg} setBannerImg={setBannerImg}
                            />
                        )}
                    </div>
                </main>
            </div>

            {selectedOrder && (
                <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={updateOrderStatus} onPrint={handlePrintOrder} />
            )}

            {isProdModalOpen && (
                <ProductFormModal editingProduct={editingProduct} categories={categories} onClose={() => setIsProdModalOpen(false)} onSave={handleSaveProduct} />
            )}
        </div>
    );
}