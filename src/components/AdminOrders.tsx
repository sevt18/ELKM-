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
  const totalOrdersCount = orders.length + 79;
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
    <div className="space-y-5 pb-24 md:pb-12">
      {/* Admin Mode Badge Bar */}
      <div className="w-full bg-slate-950 text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
              Panel de Control de Comandas y Pedidos
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Cafetería IUSH • Gestión en tiempo real de cocina y entregas
            </p>
          </div>
        </div>

        <button
          onClick={onSimulateNewOrder}
          className="self-start sm:self-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Simular Pedido Entrante</span>
        </button>
      </div>

      {/* Live Alert Banner */}
      {showAlertBanner && latestPendingOrder && (
        <div className="w-full bg-amber-400 text-slate-950 rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-3 animate-pulse border border-amber-500">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 text-amber-400 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black leading-tight truncate">
                ¡Nuevo Pedido Recibido! (#{latestPendingOrder.id})
              </p>
              <p className="text-xs font-semibold text-slate-900 truncate">
                {latestPendingOrder.studentName} • {latestPendingOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAlertBanner(false)}
            className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 transition"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Responsive KPI Bento Grid (2 cols on mobile, 4 cols on tablet/desktop!) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Hoy */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Hoy
            </span>
            <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[16px]">receipt</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalOrdersCount}</span>
            <span className="text-xs text-slate-500 font-semibold">pedidos</span>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-600 font-bold">
            <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> +12% vs ayer
          </div>
        </div>

        {/* Ventas COP */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ventas COP
            </span>
            <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[16px]">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-slate-900 truncate block">
              ${totalSalesCOP.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-500 font-semibold">
            <span className="material-symbols-outlined text-[14px] mr-0.5 text-blue-600">point_of_sale</span>
            Turno Completo
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pendientes
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{pendingCount}</span>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-200">
              Por atender
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Tiempo prom: 4 min</p>
        </div>

        {/* En Preparación */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              En Preparación
            </span>
            <span className="material-symbols-outlined text-[18px] text-blue-700">soup_kitchen</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{prepCount}</span>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 text-xs font-bold rounded-full border border-blue-200">
              En cocina
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            {readyCount} listos para entrega
          </p>
        </div>
      </section>

      {/* Filter Tabs by State */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
            Filtrar por Estado de Comanda
          </h2>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'orden visible' : 'órdenes visibles'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilter('todos')}
            className={`px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              filter === 'todos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pendiente')}
            className={`px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              filter === 'pendiente'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('preparando')}
            className={`px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              filter === 'preparando'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            En Preparación ({prepCount})
          </button>
          <button
            onClick={() => setFilter('listo')}
            className={`px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              filter === 'listo'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Listos ({readyCount})
          </button>
          <button
            onClick={() => setFilter('entregado')}
            className={`px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              filter === 'entregado'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Entregados ({deliveredCount})
          </button>
        </div>
      </section>

      {/* Orders Grid (1 col on mobile, 2 cols on md, 3 cols on xl!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl py-12 px-4 text-center border border-slate-200 shadow-sm space-y-2">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <span className="material-symbols-outlined text-[32px]">search_off</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">No hay pedidos con este filtro</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Selecciona otro estado para ver la cola de pedidos o simula una nueva orden entrante con el botón superior.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            return (
              <article
                key={order.id}
                className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200 shadow-sm space-y-3.5 transition-all hover:border-blue-400 hover:shadow-md flex flex-col justify-between"
              >
                {/* Header: Order ID, Timestamp & Status Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
                          #{order.id}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-0.5 font-medium">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>{' '}
                          {order.timestamp}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">{order.studentName}</p>
                      <span className="text-[10px] sm:text-[11px] text-slate-500 inline-block font-medium">
                        {order.studentProgram || 'Estudiante IUSH'}
                      </span>
                    </div>

                    {/* Status Badge */}
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
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-800 border border-slate-100 mt-3">
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
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg mt-2 font-medium">
                        <span className="material-symbols-outlined text-[15px]">info</span>
                        <span>Nota: {order.note}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer details & Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-xs">
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
                        {order.paymentMethod}
                      </span>
                      <span className="material-symbols-outlined text-[13px] text-emerald-600">
                        check_circle
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-blue-700">
                      Total: {formatCOP(order.total)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div>
                    {order.status === 'pendiente' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAdvance(order.id, 'preparando')}
                          className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-sm transition"
                        >
                          <span className="material-symbols-outlined text-[16px]">soup_kitchen</span>
                          <span>Preparar</span>
                        </button>
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition"
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
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
