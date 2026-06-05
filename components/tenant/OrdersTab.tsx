"use client";

import { useState } from "react";
import { MessageSquare, Printer, Check, Clock, User, Wallet, GripVertical } from "lucide-react";
import { Order } from "@/types/tenant";

interface OrdersTabProps {
    orders: Order[];
    onSelectOrder: (order: Order) => void;
    onUpdateStatus: (id: string, status: Order["status"]) => void;
    onPrint: (order: Order) => void;
}

export default function OrdersTab({ orders, onSelectOrder, onUpdateStatus, onPrint }: OrdersTabProps) {
    // Configurações visuais limpas e elegantes para as colunas do Kanban
    const columns: { id: Order["status"]; label: string; dotColor: string }[] = [
        { id: "Recebido", label: "Novos Pedidos", dotColor: "bg-rose-500" },
        { id: "Sendo preparado", label: "Na Cozinha", dotColor: "bg-amber-500" },
        { id: "A caminho", label: "Com o Entregador", dotColor: "bg-blue-500" },
        { id: "Entregue", label: "Concluídos", dotColor: "bg-emerald-500" }
    ];

    // Estados para controlar animações fluidas e feedback visual
    const [isOverColumn, setIsOverColumn] = useState<string | null>(null);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, orderId: string) => {
        setDraggedId(orderId);
        e.dataTransfer.setData("text/plain", orderId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
        setDraggedId(null);
        setIsOverColumn(null);
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        if (isOverColumn !== columnId) {
            setIsOverColumn(columnId);
        }
    };

    const handleDrop = (e: React.DragEvent, targetStatus: Order["status"]) => {
        e.preventDefault();
        const orderId = e.dataTransfer.getData("text/plain");
        if (orderId) {
            onUpdateStatus(orderId, targetStatus);
        }
        setIsOverColumn(null);
        setDraggedId(null);
    };

    return (
        <div className="space-y-6 flex flex-col h-full select-none">
            <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Painel de Produção</h2>
                <p className="text-xs text-slate-500 mt-0.5">Arraste os cards lateralmente para atualizar o status do fluxo em tempo real.</p>
            </div>

            {/* Grid do Kanban - Rolagem horizontal suave no mobile */}
            <div className="grid grid-cols-4 gap-4 items-start select-none w-full">
                {columns.map((column) => {
                    const columnOrders = orders.filter(o => o.status === column.id);
                    const isCurrentOver = isOverColumn === column.id;

                    return (
                        <div
                            key={column.id}
                            onDragOver={(e) => handleDragOver(e, column.id)}
                            onDragLeave={() => setIsOverColumn(null)}
                            onDrop={(e) => handleDrop(e, column.id)}
                            className={`flex-1 min-w-[290px] md:min-w-0 bg-slate-100/70 border rounded-2xl p-3 flex flex-col gap-3 transition-all duration-200 ${
                                isCurrentOver 
                                    ? "border-slate-400/80 bg-slate-200/50 ring-2 ring-slate-900/5" 
                                    : "border-slate-200/60"
                            }`}
                        >
                            {/* Cabeçalho da Coluna Minimalista */}
                            <div className="flex items-center justify-between px-1 py-0.5">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${column.dotColor} shadow-xs`} />
                                    <span className="text-xs font-bold text-slate-700 tracking-tight">{column.label}</span>
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-3xs">
                                    {columnOrders.length}
                                </span>
                            </div>

                            {/* Container dos Cards */}
                            <div className="flex flex-col gap-2.5 min-h-[500px] overflow-y-auto max-h-[calc(100vh-260px)] pr-0.5">
                                {columnOrders.map((order) => {
                                    const isBeingDragged = draggedId === order.id;

                                    return (
                                        <div
                                            key={order.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, order.id)}
                                            onDragEnd={handleDragEnd}
                                            onClick={() => onSelectOrder(order)}
                                            className={`bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all duration-150 cursor-grab active:cursor-grabbing group relative space-y-3 ${
                                                isBeingDragged ? "opacity-30 scale-95 border-dashed border-slate-400 shadow-none" : ""
                                            }`}
                                        >
                                            {/* Header do Card */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-slate-100 text-slate-700 text-[11px] font-black px-1.5 py-0.5 rounded-md border border-slate-200">
                                                        {order.id}
                                                    </span>
                                                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                                        <User size={12} className="text-slate-400" />
                                                        <span className="truncate max-w-[120px]">{order.customer.split(" ")[0]}</span>
                                                    </div>
                                                </div>
                                                {/* Textura de Grip sutil lateral que aparece ao passar o mouse */}
                                                <GripVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-grab" />
                                            </div>

                                            {/* Lista Resumida de Itens */}
                                            <div className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/50 border border-slate-100 p-2 rounded-lg">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="line-clamp-1">
                                                        <span className="text-slate-400 font-bold text-[11px]">{item.quantity}x</span> {item.name}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Tags e Observações de Alerta */}
                                            <div className="flex flex-wrap gap-1.5 items-center">
                                                <div className="inline-flex items-center gap-1 bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px] font-medium">
                                                    <Clock size={11} className="text-slate-400" />
                                                    {order.time}
                                                </div>
                                                <div className="inline-flex items-center gap-1 bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px] font-medium">
                                                    <Wallet size={11} className="text-slate-400" />
                                                    {order.paymentMethod}
                                                </div>
                                                {order.items.some(i => i.observation) && (
                                                    <div className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded-md text-[10px] font-bold animate-pulse">
                                                        <MessageSquare size={11} />
                                                        Obs
                                                    </div>
                                                )}
                                            </div>

                                            {/* Rodapé Dinâmico com Ações e Preço */}
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2" onClick={(e) => e.stopPropagation()}>
                                                <span className="text-xs font-black text-slate-900">
                                                    {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </span>

                                                <div className="flex gap-1.5">
                                                    {/* Botões Rápidos e Discretos de Avanço */}
                                                    {order.status === "Recebido" && (
                                                        <button onClick={() => onUpdateStatus(order.id, "Sendo preparado")} className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md hover:bg-slate-800 transition-colors cursor-pointer">
                                                            Aceitar
                                                        </button>
                                                    )}
                                                    {order.status === "Sendo preparado" && (
                                                        <button onClick={() => onUpdateStatus(order.id, "A caminho")} className="px-2 py-1 bg-amber-500 text-slate-900 text-[10px] font-bold rounded-md hover:bg-amber-600 transition-colors cursor-pointer">
                                                            Despachar
                                                        </button>
                                                    )}
                                                    {order.status === "A caminho" && (
                                                        <button onClick={() => onUpdateStatus(order.id, "Entregue")} className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-md hover:bg-emerald-700 transition-colors cursor-pointer">
                                                            Concluir
                                                        </button>
                                                    )}
                                                    {order.status === "Entregue" && (
                                                        <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 p-0.5 rounded-md flex items-center justify-center">
                                                            <Check size={13} strokeWidth={3} />
                                                        </span>
                                                    )}

                                                    <button onClick={() => onPrint(order)} className="p-1 bg-slate-50 hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 rounded-md border border-slate-200 transition-colors cursor-pointer">
                                                        <Printer size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {columnOrders.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center p-8 border border-dashed border-slate-300/60 rounded-xl text-center text-slate-400 italic text-[11px] font-medium min-h-[100px] bg-white/40">
                                        Sem pedidos nesta etapa
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}