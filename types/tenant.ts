// tenant.ts
export interface AddOn {
    name: string;
    price: number;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
    active: boolean;
    addOns: AddOn[];
}

export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    selectedAddOns: AddOn[];
    observation?: string;
}

export interface Order {
    id: string;
    customer: string;
    phone: string;
    time: string; // Ex: "Há 5 min" ou data "12/10/2023 14:30"
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: string;
    address: string;
    status: "Recebido" | "Sendo preparado" | "A caminho" | "Entregue" | "Cancelado";
}

export interface Coupon {
    id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    active: boolean;
    usedCount: number;
}

export type TabType = "pedidos" | "historico" | "produtos" | "cupons" | "pagamentos" | "entregas" | "financeiro" | "personalizacao";