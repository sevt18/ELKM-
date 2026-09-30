export type OrderStatus = 'pendiente' | 'preparando' | 'listo' | 'entregado';

export interface ProductItem {
  id: string;
  name: string;
  category: 'almuerzos' | 'snacks' | 'bebidas' | 'desayunos' | 'promos';
  price: number;
  description: string;
  portions: number;
  available: boolean;
  image: string;
  isPromo?: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. "ORD-2048"
  studentName: string;
  studentProgram?: string;
  timestamp: string;
  items: OrderItem[];
  note?: string;
  paymentMethod: 'Saldo IUSH' | 'Nequi' | 'Daviplata' | 'Efectivo en Caja';
  total: number;
  status: OrderStatus;
  estimatedTime?: string;
  approxTime?: string;
  pickupCounter?: string;
}

export interface PastOrder {
  id: string;
  summary: string;
  date: string;
  total: number;
  status: 'Entregado';
  items: { name: string; quantity: number; price: number }[];
}

export interface StudentProfile {
  name: string;
  email: string;
  program: string;
  semester: string;
  balance: number;
}
