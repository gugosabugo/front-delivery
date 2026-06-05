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
    time: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: string;
    address: string;
    status: "Recebido" | "Sendo preparado" | "A caminho" | "Entregue";
}

export type TabType = "pedidos" | "produtos" | "personalizacao" | "pagamentos" | "entregas" | "financeiro";