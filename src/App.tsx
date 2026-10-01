import React, { useState } from 'react';
import {
  ProductItem,
  CartItem,
  Order,
  PastOrder,
  StudentProfile,
  OrderStatus,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  PAST_ORDERS,
  INITIAL_USER,
  playAudioFeedback,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StudentMenu } from './components/StudentMenu';
import { StudentTracker } from './components/StudentTracker';
import { AdminOrders } from './components/AdminOrders';
import { AdminInventory } from './components/AdminInventory';
import { CartDrawer } from './components/CartDrawer';
import { UserProfileModal } from './components/UserProfileModal';
import { Toast } from './components/Toast';

export default function App() {
  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');
  const [currentTab, setCurrentTab] = useState<'menu' | 'tracker' | 'orders' | 'inventory'>('menu');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(PAST_ORDERS);
  const [user, setUser] = useState<StudentProfile>(INITIAL_USER);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Active student order (defaulting to ORD-2048)
  const [activeOrderId, setActiveOrderId] = useState<string>('ORD-2048');

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string | null; icon?: string; visible: boolean }>({
    message: null,
    icon: 'check_circle',
    visible: false,
  });

  const showToast = (message: string, icon = 'check_circle') => {
    setToast({ message, icon, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  };

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0] || null;

  // Role switching
  const handleRoleChange = (role: 'student' | 'admin') => {
    setActiveRole(role);
    playAudioFeedback(600, 0.08);
    if (role === 'admin') {
      if (currentTab === 'menu' || currentTab === 'tracker') {
        setCurrentTab('orders');
      }
      showToast('Cambiado a Modo Cafetería / Admin', 'storefront');
    } else {
      if (currentTab === 'orders' || currentTab === 'inventory') {
        setCurrentTab('menu');
      }
      showToast('Cambiado a Modo Estudiante IUSH', 'school');
    }
  };

  // Bottom / Top tab navigation
  const handleSelectTab = (tab: 'menu' | 'tracker' | 'orders' | 'inventory') => {
    playAudioFeedback(550, 0.08);
    setCurrentTab(tab);
    if (tab === 'menu' || tab === 'tracker') {
      setActiveRole('student');
    } else {
      setActiveRole('admin');
    }
  };

  // Cart operations
  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`"${product.name}" agregado al pedido`, 'check_circle');
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Producto eliminado del pedido', 'delete');
  };

  // Checkout confirmation
  const handleConfirmOrder = (
    items: CartItem[],
    note: string,
    paymentMethod: 'Saldo IUSH' | 'Nequi' | 'Daviplata' | 'Efectivo en Caja',
    total: number
  ) => {
    const newOrderNumber = 2053 + orders.length;
    const newId = `ORD-${newOrderNumber}`;

    const newOrder: Order = {
      id: newId,
      studentName: user.name,
      studentProgram: `${user.program} • ${user.semester}`,
      timestamp: 'Ahora',
      items: items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.image,
      })),
      note: note || undefined,
      paymentMethod,
      total,
      status: 'pendiente',
      estimatedTime: '12 - 15 min',
      approxTime: 'Aprox: 15 min',
      pickupCounter: 'Mostrador Principal - Bloque Central (Ventanilla #2)',
    };

    // Deduct balance if Saldo IUSH
    if (paymentMethod === 'Saldo IUSH') {
      setUser((prev) => ({
        ...prev,
        balance: Math.max(0, prev.balance - total),
      }));
    }

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newId);
    setCart([]);
    setIsCartOpen(false);
    setCurrentTab('tracker');
    setActiveRole('student');
    showToast(`¡Pedido #${newId} enviado a la Cafetería!`, 'check_circle');
  };

  // Advance order status
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: nextStatus,
            estimatedTime:
              nextStatus === 'listo'
                ? '¡Listo para reclamar!'
                : nextStatus === 'entregado'
                ? 'Entregado'
                : o.estimatedTime,
          };
        }
        return o;
      })
    );
  };

  // Advance active student order linearly
  const handleAdvanceActiveOrder = (orderId: string) => {
    const current = orders.find((o) => o.id === orderId);
    if (!current) return;

    const pipeline: OrderStatus[] = ['pendiente', 'preparando', 'listo', 'entregado'];
    const curIdx = pipeline.indexOf(current.status);
    if (curIdx < pipeline.length - 1) {
      const nextStatus = pipeline[curIdx + 1];
      handleUpdateOrderStatus(orderId, nextStatus);
      const labels: Record<OrderStatus, string> = {
        pendiente: 'Pedido recibido',
        preparando: '¡Tu orden ya está en preparación en cocina!',
        listo: '🔔 ¡Tu orden está lista para reclamar en mostrador!',
        entregado: '✅ ¡Orden entregada con éxito!',
      };
      showToast(labels[nextStatus], 'campaign');
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Reorder past combos
  const handleReorder = (pastOrder: PastOrder) => {
    pastOrder.items.forEach((item) => {
      const product = products.find((p) => p.name === item.name) || {
        id: `reorder-${Date.now()}-${item.name}`,
        name: item.name,
        category: 'snacks' as const,
        price: item.price || 4000,
        description: 'Combo guardado del historial',
        portions: 20,
        available: true,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAil3_pgt-QDoVH6DF3FwigqiRSU0Wmwubsu6z8Ygk0ufpbq-7-xq4cs3hfToZbnl7DP8jKMJyqZkCogiYsLUW0wPWJmcwKCj052HVjfkpvo_47ZaTloiLj-uhhUJJcPNt_7Lc4BTemkl99uWlz1g7j1jzsy39JtIY_W9EJv_YsGRka-pgYnK7Y-AckZf5nLDurlGRnUcTK_D0NR87WhgTaVUwp8coxtyCVvzPHRD1QsbWbpBRPEY7ivw',
      };
      handleAddToCart(product);
    });
    setIsCartOpen(true);
  };

  // Inventory actions
  const handleToggleProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, available: !p.available } : p))
    );
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
  };

  const handleUpdatePortions = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextPortions = Math.max(0, p.portions + delta);
          return {
            ...p,
            portions: nextPortions,
            available: nextPortions > 0 ? p.available : false,
          };
        }
        return p;
      })
    );
  };

  const handleAddProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Simulate new incoming order for kitchen
  const handleSimulateNewOrder = () => {
    const randomStudents = [
      { name: 'Andrés Restrepo', program: 'Ingeniería Mecánica • Semestre 7' },
      { name: 'Laura Jaramillo', program: 'Diseño Gráfico • Semestre 5' },
      { name: 'Carlos Mario Vélez', program: 'Administración • Semestre 4' },
    ];
    const pickedStudent = randomStudents[Math.floor(Math.random() * randomStudents.length)];
    const newNum = 2055 + Math.floor(Math.random() * 80);
    const newId = `ORD-${newNum}`;

    const newSimOrder: Order = {
      id: newId,
      studentName: pickedStudent.name,
      studentProgram: pickedStudent.program,
      timestamp: 'Justo ahora',
      items: [
        {
          name: 'Empanada de Carne con Ají',
          quantity: 2,
          price: 3200,
        },
        {
          name: 'Capuchino Artesanal IUSH',
          quantity: 1,
          price: 4800,
        },
      ],
      note: 'Ají y servilletas adicionales por favor.',
      paymentMethod: 'Nequi',
      total: 11200,
      status: 'pendiente',
      estimatedTime: '10 min',
      approxTime: 'Aprox: 10:45 AM',
      pickupCounter: 'Mostrador Principal - Bloque Central',
    };

    setOrders((prev) => [newSimOrder, ...prev]);
    playAudioFeedback(880, 0.2);
    showToast(`¡Nuevo pedido en cola! #${newId} (${pickedStudent.name})`, 'notifications_active');
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'pendiente').length;
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Global Toast */}
      <Toast
        message={toast.message}
        icon={toast.icon}
        visible={toast.visible}
      />

      {/* Top Header: 100% Fluid on Mobile, Tablet & Desktop */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        cartCount={cartTotalItems}
        cartTotal={cartTotalPrice}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Main Content Area: Responsive container that gracefully expands up to max-w-7xl */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 md:pb-12">
        {currentTab === 'menu' && (
          <StudentMenu
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
            onGoToTracker={() => setCurrentTab('tracker')}
            user={user}
            onRechargeBalance={() => setIsUserModalOpen(true)}
          />
        )}

        {currentTab === 'tracker' && (
          <StudentTracker
            activeOrder={activeOrder}
            pastOrders={pastOrders}
            user={user}
            onGoToMenu={() => setCurrentTab('menu')}
            onAdvanceOrderStatus={handleAdvanceActiveOrder}
            onReorder={handleReorder}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'orders' && (
          <AdminOrders
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onCancelOrder={handleCancelOrder}
            onSimulateNewOrder={handleSimulateNewOrder}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'inventory' && (
          <AdminInventory
            products={products}
            onToggleStock={handleToggleProductStock}
            onUpdateProductPrice={handleUpdateProductPrice}
            onUpdatePortions={handleUpdatePortions}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onGoToOrders={() => setCurrentTab('orders')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation (Mobile Only, md:hidden) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Responsive Cart Drawer: Bottom Sheet on Mobile, Slide-Over on Desktop */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onConfirmOrder={handleConfirmOrder}
        user={user}
        onShowToast={showToast}
      />

      {/* User Profile / Student Credentials Modal */}
      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={user}
        onSelectUser={(selected) => setUser(selected)}
        onRecharge={(amount) =>
          setUser((prev) => ({ ...prev, balance: prev.balance + amount }))
        }
        onShowToast={showToast}
      />
    </div>
  );
}
