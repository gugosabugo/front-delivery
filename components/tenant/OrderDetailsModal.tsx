"use client";

import { X, ClipboardList, User, MapPin, CreditCard, MessageSquare, Printer, Check } from "lucide-react";
import { Order } from "@/types/tenant";

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
    onUpdateStatus: (id: string, status: Order["status"]) => void;
    onPrint: (order: Order) => void;
}

export default function OrderDetailsModal({ order, onClose, onUpdateStatus, onPrint }: OrderDetailsModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end backdrop-blur-xs">
            <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ClipboardList size={18} className="text-slate-600" />
                        <div>
                            <h3 className="font-black text-sm text-slate-900">Detalhes do Pedido {order.id}</h3>
                            <span className="text-[10px] text-slate-400 font-mono">{order.time}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px]"><User size={13} /> Dados do Cliente</div>
                        <div className="font-bold text-slate-800 text-sm">{order.customer}</div>
                        <div className="text-slate-500 font-medium">{order.phone}</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px]"><MapPin size={13} /> Endereço de Entrega</div>
                        <p className="text-slate-700 font-medium leading-relaxed">{order.address}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px]"><CreditCard size={13} /> Forma de Pagamento</div>
                        <span className="inline-block bg-slate-200/60 text-slate-800 px-2 py-1 rounded-md font-bold">{order.paymentMethod}</span>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Itens Solicitados</h4>
                        <div className="space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="border border-slate-100 rounded-xl p-3 space-y-2 bg-white shadow-xs">
                                    <div className="flex justify-between font-bold text-slate-900">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>{(item.price * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                    </div>
                                    {item.selectedAddOns.length > 0 && (
                                        <div className="pl-3 border-l-2 border-slate-200 text-slate-500 text-[11px] font-medium space-y-0.5">
                                            {item.selectedAddOns.map((addon, aIdx) => (
                                                <p key={aIdx}>+ {addon.name} (+ R$ {addon.price.toFixed(2)})</p>
                                            ))}
                                        </div>
                                    )}
                                    {item.observation && (
                                        <div className="bg-red-50/70 border border-red-100 text-red-900 rounded-xl p-3 flex items-start gap-2 mt-1">
                                            <MessageSquare size={13} className="text-red-500 shrink-0 mt-0.5" />
                                            <div className="space-y-0.5">
                                                <span className="block text-[9px] font-black text-red-600 uppercase">Observação Importante:</span>
                                                <p className="font-medium leading-relaxed">{item.observation}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4 space-y-2 font-medium text-slate-600">
                        <div className="flex justify-between"><span>Subtotal</span><span>{order.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
                        <div className="flex justify-between"><span>Taxa de Entrega</span><span>{order.deliveryFee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
                        <div className="flex justify-between text-sm font-black text-slate-900 border-t border-dashed pt-2"><span>Total Geral</span><span>{order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2 shrink-0">
                    <button onClick={() => onPrint(order)} className="w-full bg-slate-900 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer">
                        <Printer size={16} /> Imprimir Cupom KDS
                    </button>
                    <div className="flex gap-2">
                        {order.status === "Recebido" && <button onClick={() => onUpdateStatus(order.id, "Sendo preparado")} className="flex-1 bg-red-600 text-white text-xs font-black h-11 rounded-xl hover:bg-red-700 cursor-pointer">Aprovar e Iniciar Preparo</button>}
                        {order.status === "Sendo preparado" && <button onClick={() => onUpdateStatus(order.id, "A caminho")} className="flex-1 bg-yellow-500 text-slate-900 text-xs font-black h-11 rounded-xl hover:bg-yellow-600 cursor-pointer">Despachar para Entrega</button>}
                        {order.status === "A caminho" && <button onClick={() => onUpdateStatus(order.id, "Entregue")} className="flex-1 bg-emerald-600 text-white text-xs font-black h-11 rounded-xl hover:bg-emerald-700 cursor-pointer">Confirmar como Entregue</button>}
                        {order.status === "Entregue" && <div className="flex-1 bg-slate-200 text-slate-500 text-xs font-bold h-11 rounded-xl flex items-center justify-center gap-1.5 border border-slate-300"><Check size={14} strokeWidth={3} /> Pedido Finalizado</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}