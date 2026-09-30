import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { formatCOP, playAudioFeedback } from '../data/mockData';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onCancelOrder: (orderId: string) => void;
  onSimulateNewOrder: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateOrderStatus,
  onCancelOrder,
  onSimulateNewOrder,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'todos' | OrderStatus>('todos');
  const [showAlertBanner, setShowAlertBanner] = useState(true);

  // Compute live KPIs
  const pendingCount = orders.filter((o) => o.status === 'pendiente').length;
  const prepCount = orders.filter((o) => o.status === 'preparando').length;
  const readyCount = orders.filter((o) => o.status === 'listo').length;
  const deliveredCount = orders.filter((o) => o.status === 'entregado').length;
  const totalOrdersCount = orders.length + 79; // Baseline + simulated
  const totalSalesCOP = 1240000 + orders.reduce((sum, o) => sum + (o.status !== 'pendiente' ? o.total : 0), 0);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'todos') return true;
    return order.status === filter;
  });

  const handleAdvance = (orderId: string, nextStatus: OrderStatus) => {
    playAudioFeedback(nextStatus === 'listo' ? 880 : 700, 0.14);
    onUpdateOrderStatus(orderId, nextStatus);
    const msgs: Record<OrderStatus, string> = {
      pendiente: `Pedido #${orderId} en cola`,
      preparando: `Pedido #${orderId} enviado a preparación en cocina`,
      listo: `Notificación enviada: #${orderId} ¡Listo para reclamar!`,
      entregado: `Pedido #${orderId} entregado con éxito`,
    };
    onShowToast(msgs[nextStatus], 'check_circle');
  };

  const handleCancel = (orderId: string) => {
    if (confirm(`¿Estás seguro de cancelar el pedido #${orderId}?`)) {
      playAudioFeedback(400, 0.15);
      onCancelOrder(orderId);
      onShowToast(`Pedido #${orderId} cancelado y reembolsado`, 'cancel');
    }
  };

  const latestPendingOrder = orders.find((o) => o.status === 'pendiente');

  return (
    <div className="space-y-4 pb-24">
      {/* Admin Mode Badge Bar */}
      <div className="w-full bg-slate-900 text-white rounded-2xl p-2.5 px-3.5 flex items-center justify-between shadow-sm border border-slate-800">
        <div className="flex items-center gap-2 text-blue-400">
          <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          <span className="text-xs font-bold tracking-tight text-white">
            Modo Administrador Cafetería
          </span>
        </div>
        <button
          onClick={onSimulateNewOrder}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
        >
          <span className="material-symbols-outlined text-[15px]">add_circle</span>
          <span>+ Simular Pedido</span>
        </button>
      </div>

      {/* Live Alert Banner */}
      {showAlertBanner && latestPendingOrder && (
        <div className="w-full bg-amber-500 text-slate-950 rounded-2xl p-3 shadow-md flex items-center justify-between gap-3 animate-pulse border border-amber-600">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 text-amber-400 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold leading-tight truncate">
                ¡Nuevo Pedido Recibido! (#{latestPendingOrder.id})
              </p>
              <p className="text-[11px] font-semibold text-slate-900 truncate">
                {latestPendingOrder.studentName} • {latestPendingOrder.items.map((i) => `${i.quantity} ${i.name}`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAlertBanner(false)}
            className="p-1 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 transition"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-2 gap-2.5">
        {/* Total Hoy */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Hoy
            </span>
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px]">receipt</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalOrdersCount}</span>
            <span className="text-[11px] text-slate-500 font-semibold">pedidos</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-bold">
            <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> +12% vs ayer
          </div>
        </div>

        {/* Ventas COP */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Ventas COP
            </span>
            <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px]">payments</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-slate-900 truncate block">
              ${totalSalesCOP.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="mt-1 flex items-center text-[10px] text-slate-500 font-semibold">
            <span className="material-symbols-outlined text-[12px] mr-0.5 text-blue-600">point_of_sale</span>
            Turno Completo
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Pendientes
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{pendingCount}</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full border border-amber-200">
              Por atender
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Tiempo prom: 4 min</p>
        </div>

        {/* En Preparación */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              En Preparación
            </span>
            <span className="material-symbols-outlined text-[16px] text-blue-700">soup_kitchen</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{prepCount}</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-bold rounded-full border border-blue-200">
              En cocina
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {readyCount} listos para entrega
          </p>
        </div>
      </section>

      {/* Filter Tabs by State */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Filtrar por Estado
          </h2>
          <span className="text-[11px] font-bold text-blue-700">
            {filteredOrders.length} órdenes visibles
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          <button
            onClick={() => setFilter('todos')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === 'todos'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pendiente')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === 'pendiente'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('preparando')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === 'preparando'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            En Preparación ({prepCount})
          </button>
          <button
            onClick={() => setFilter('listo')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === 'listo'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Listos ({readyCount})
          </button>
          <button
            onClick={() => setFilter('entregado')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === 'entregado'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Entregados ({deliveredCount})
          </button>
        </div>
      </section>

      {/* Orders List Container */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl py-10 px-4 text-center border border-slate-200 shadow-sm space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800">No hay pedidos con este filtro</h4>
            <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto">
              Selecciona otro estado para ver la cola de pedidos o simula una nueva orden entrante.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            return (
              <article
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 transition-all hover:border-slate-300"
              >
                {/* Header: Order ID, Timestamp & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 font-mono">#{order.id}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-0.5 font-medium">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>{' '}
                        {order.timestamp}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{order.studentName}</p>
                    <span className="text-[10px] text-slate-500 inline-block font-medium">
                      {order.studentProgram || 'Estudiante IUSH'}
                    </span>
                  </div>

                  {/* Badge */}
                  {order.status === 'pendiente' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                      Pendiente
                    </span>
                  )}
                  {order.status === 'preparando' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300">
                      En Preparación
                    </span>
                  )}
                  {order.status === 'listo' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                      Listo para Reclamar
                    </span>
                  )}
                  {order.status === 'entregado' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Entregado
                    </span>
                  )}
                </div>

                {/* Items Box */}
                <div className="bg-slate-50 rounded-xl p-2.5 space-y-1.5 text-xs text-slate-800 border border-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-semibold">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-bold text-slate-500">{formatCOP(item.price * item.quantity)}</span>
                    </div>
                  ))}

                  {/* Kitchen Note */}
                  {order.note && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg mt-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">info</span>
                      <span>Nota: {order.note}</span>
                    </div>
                  )}
                </div>

                {/* Payment info & Total */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    <span className="material-symbols-outlined text-[14px] text-blue-700">
                      {order.paymentMethod === 'Saldo IUSH'
                        ? 'credit_card'
                        : order.paymentMethod === 'Nequi'
                        ? 'account_balance_wallet'
                        : order.paymentMethod === 'Daviplata'
                        ? 'smartphone'
                        : 'payments'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">
                      {order.paymentMethod} ({formatCOP(order.total)})
                    </span>
                    <span className="material-symbols-outlined text-[13px] text-emerald-600">
                      check_circle
                    </span>
                  </div>
                  <span className="text-xs font-black text-blue-700">
                    Total: {formatCOP(order.total)}
                  </span>
                </div>

                {/* Action Buttons based on state */}
                <div className="pt-1">
                  {order.status === 'pendiente' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAdvance(order.id, 'preparando')}
                        className="py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-sm transition"
                      >
                        <span className="material-symbols-outlined text-[16px]">soup_kitchen</span>
                        <span>Preparar</span>
                      </button>
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                        <span>Cancelar</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'preparando' && (
                    <button
                      onClick={() => handleAdvance(order.id, 'listo')}
                      className="w-full py-2.5 px-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-sm transition"
                    >
                      <span className="material-symbols-outlined text-[16px]">notifications</span>
                      <span>Marcar 'Listo para Entregar'</span>
                    </button>
                  )}

                  {order.status === 'listo' && (
                    <button
                      onClick={() => handleAdvance(order.id, 'entregado')}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-sm transition"
                    >
                      <span className="material-symbols-outlined text-[16px]">done_all</span>
                      <span>Confirmar Entrega</span>
                    </button>
                  )}

                  {order.status === 'entregado' && (
                    <div className="w-full py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      <span>Pedido Completado y Retirado</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
