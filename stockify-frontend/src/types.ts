export interface User {
    id: number;
    email: string;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    userId: number;
}

export interface Inventory {
    id: number;
    productId: number;
    quantity: number;
    type: 'entry' | 'exit';
    userId: number;
    createdAt: string;
}

export interface Metric {
    id: number;
    productId: number;
    stock: number;
    timestamp: string;
}