import React, { useState } from 'react';
import { ProductItem } from '../types';
import { playAudioFeedback } from '../data/mockData';

interface AdminInventoryProps {
  products: ProductItem[];
  onToggleStock: (productId: string) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onUpdatePortions: (productId: string, delta: number) => void;
  onAddProduct: (newProduct: ProductItem) => void;
  onDeleteProduct: (productId: string) => void;
  onGoToOrders: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  products,
  onToggleStock,
  onUpdateProductPrice,
  onUpdatePortions,
  onAddProduct,
  onDeleteProduct,
  onGoToOrders,
  onShowToast,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNewModal, setShowNewModal] = useState(false);

  // Form states for new product
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<'almuerzos' | 'snacks' | 'bebidas' | 'desayunos'>('almuerzos');
  const [newPrice, setNewPrice] = useState('5.500');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('');
  const [newAvailable, setNewAvailable] = useState(true);

  const categories = [
    { id: 'all', label: `Todos (${products.length})` },
    { id: 'almuerzos', label: '🍲 Almuerzos' },
    { id: 'snacks', label: '🥟 Snacks' },
    { id: 'bebidas', label: '☕ Bebidas' },
    { id: 'desayunos', label: '🍓 Desayunos' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeCount = products.filter((p) => p.available).length;
  const outOfStockCount = products.filter((p) => !p.available).length;

  const handleToggle = (productId: string) => {
    playAudioFeedback(650, 0.1);
    onToggleStock(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      onShowToast(
        prod.available ? `"${prod.name}" marcado como Agotado` : `"${prod.name}" ahora está En Stock`,
        'inventory'
      );
    }
  };

  const handlePriceChange = (productId: string, valStr: string) => {
    const cleanNum = parseInt(valStr.replace(/\D/g, ''), 10);
    if (!isNaN(cleanNum) && cleanNum > 0) {
      onUpdateProductPrice(productId, cleanNum);
      onShowToast(`Precio actualizado a $${cleanNum.toLocaleString('es-CO')}`, 'attach_money');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const numericPrice = parseInt(newPrice.replace(/\D/g, ''), 10) || 5000;
    const defaultImg =
      newCat === 'almuerzos'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDif3leshu7SB92-yGEPSxEU3fteK3wUcSvAown-5E4CzcknG3mmQH4dxFYwn34B_0PGVYtMVmRtNWEstCAa4aXEDc8wLyKNVh9M1jRO_KMqmFnKcbOWZYtpD5g-CSD8SUA6OHkyh9BlzNaziaQBh16x1fgBIm94hBvSMyawddL4RRLlnveWtYxCUtHs9Bw12hvn3-3t1wrxMZHqnnTu4XMTUwuVDBgfjm-S3Wsfoa8RUinw-sRD9uGpw'
        : newCat === 'snacks'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAil3_pgt-QDoVH6DF3FwigqiRSU0Wmwubsu6z8Ygk0ufpbq-7-xq4cs3hfToZbnl7DP8jKMJyqZkCogiYsLUW0wPWJmcwKCj052HVjfkpvo_47ZaTloiLj-uhhUJJcPNt_7Lc4BTemkl99uWlz1g7j1jzsy39JtIY_W9EJv_YsGRka-pgYnK7Y-AckZf5nLDurlGRnUcTK_D0NR87WhgTaVUwp8coxtyCVvzPHRD1QsbWbpBRPEY7ivw'
        : newCat === 'bebidas'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6ajBGWIHj6_1R3bmNG3014panYOt-MRVm_DV1u6_PBNKOFfSdTJ555gkFO-aH6WZcJdIyTwPG9IyNXcJTwcFaOTs3osni3VeCvUPxHcjXeKIK8jZrKn8TfSi-t0MJsbjl3NTb2OBC5vQ3uX7UAvaPpuMVTjBoLOfCpSXxEiwVUocJx1r2Mz4uYNuauiE96PnDkCm0m0FPkt7NbEVR1FC_mDR2Dbl4G94KE5RNoanVd186JECXSG1_Ug'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyTviKl9SxwPkJ387LufY1FF0HxypCHMXSVrhHAKFODWjuqRHmfEkWu2sOXlAc6bGSnQ_da1rl1pPzcyxa5_mL-jaj8b1K3h9YC3MyaWY3mSPAnun-wsd-Ubgk9wYyBs4rzKThJdIEbKEcovdrJ0fbrDn21t0S4mnHRZmYlCRNJYNYbSMe0f84_Z9cFjZqfmVw2ba85qgkMKb_e6kHMg17Ssm24S4ZrxRJnWBJXyU_WV4enBvaJzdSPg';

    const newProd: ProductItem = {
      id: `p-${Date.now()}`,
      name: newName.trim(),
      category: newCat,
      price: numericPrice,
      description: newDesc.trim() || 'Producto recién preparado por la cafetería IUSH.',
      portions: 25,
      available: newAvailable,
      image: newImg.trim() || defaultImg,
    };

    onAddProduct(newProd);
    setShowNewModal(false);
    setNewName('');
    setNewDesc('');
    setNewImg('');
    playAudioFeedback(750, 0.15);
    onShowToast(`¡"${newProd.name}" publicado en la carta!`, 'add_circle');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Sub-bar Toggle: Pedidos en Vivo vs Inventario y Menú */}
      <div className="flex items-center justify-between bg-slate-200/80 p-1 rounded-xl shadow-inner text-xs font-bold">
        <button
          onClick={onGoToOrders}
          className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">soup_kitchen</span>
          <span>Pedidos en Vivo</span>
        </button>
        <button className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 bg-blue-700 text-white shadow-sm transition-all">
          <span className="material-symbols-outlined text-[16px]">inventory_2</span>
          <span>Inventario y Menú</span>
        </button>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Activos */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Activos
            </span>
            <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[12px]">check_circle</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-slate-900 leading-tight">{activeCount}</span>
            <p className="text-[10px] text-slate-500 truncate font-medium">En carta hoy</p>
          </div>
        </div>

        {/* Agotados */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
              Agotados
            </span>
            <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[12px]">block</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-rose-600 leading-tight">
              {outOfStockCount}
            </span>
            <p className="text-[10px] text-slate-500 truncate font-medium">Requieren reposición</p>
          </div>
        </div>

        {/* Top Ventas */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              Top Ventas
            </span>
            <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[12px]">star</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xs font-bold text-slate-900 truncate block">Almuerzos</span>
            <p className="text-[10px] text-amber-700 font-bold truncate">+92 pedidos</p>
          </div>
        </div>
      </div>

      {/* Search Bar + Nuevo Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar empanada, jugo, almuerzo..."
            className="w-full bg-white text-xs text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
          />
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="shrink-0 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Nuevo</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.map((p) => {
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col gap-3 transition-all hover:border-slate-300 ${
                !p.available ? 'opacity-75 bg-slate-50/70' : ''
              }`}
            >
              {/* Product Info */}
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {!p.available && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                      <span className="text-[9px] font-black text-white uppercase tracking-wider px-1">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: #{p.id}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{p.description}</p>
                </div>
              </div>

              {/* Inset Controls: Price, Portions, Availability Toggle */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
                {/* Price input */}
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Precio Unitario</span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-xs font-bold text-slate-700">$</span>
                    <input
                      type="text"
                      defaultValue={p.price.toLocaleString('es-CO')}
                      onBlur={(e) => handlePriceChange(p.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handlePriceChange(p.id, (e.target as HTMLInputElement).value);
                        }
                      }}
                      className="w-16 bg-transparent text-xs font-bold text-slate-900 focus:outline-none focus:bg-white rounded px-1"
                      title="Editar precio unitario"
                    />
                  </div>
                </div>

                {/* Portions counter */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Porciones</span>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 shadow-2xs">
                      <button
                        onClick={() => onUpdatePortions(p.id, -1)}
                        className="text-slate-500 hover:text-blue-700 font-black text-xs px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-slate-900 w-5 text-center">
                        {p.portions}
                      </span>
                      <button
                        onClick={() => onUpdatePortions(p.id, 1)}
                        className="text-slate-500 hover:text-blue-700 font-black text-xs px-1"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Stock Toggle Switch */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-[9px] uppercase font-bold ${
                        p.available ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {p.available ? 'En Stock' : 'Agotado'}
                    </span>
                    <button
                      onClick={() => handleToggle(p.id)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                        p.available ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                      title={p.available ? 'Marcar como agotado' : 'Habilitar en stock'}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          p.available ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Editar & Eliminar */}
              <div className="flex items-center justify-end gap-2 pt-0.5">
                <button
                  onClick={() => onShowToast(`Editando parámetros de: ${p.name}`, 'edit')}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-slate-100 transition"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>Editar Detalle</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Retirar "${p.name}" del menú?`)) {
                      onDeleteProduct(p.id);
                      onShowToast(`"${p.name}" eliminado de la carta`, 'delete');
                    }
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-rose-50 transition"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Crear Nuevo Producto */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">post_add</span>
                </span>
                <h3 className="font-bold text-sm text-slate-900">Nuevo Producto en Cafetería</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Sándwich de Pollo Gratinado"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCat}
                    onChange={(e) =>
                      setNewCat(
                        e.target.value as 'almuerzos' | 'snacks' | 'bebidas' | 'desayunos'
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 rounded-xl focus:outline-none"
                  >
                    <option value="almuerzos">Almuerzos</option>
                    <option value="snacks">Snacks</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="desayunos">Desayunos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Precio (COP)
                  </label>
                  <input
                    type="text"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Ej: 5.500"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Descripción corta
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ingredientes principales, presentación o tamaño..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 rounded-xl focus:outline-none resize-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  URL de Imagen (Opcional)
                </label>
                <input
                  type="text"
                  value={newImg}
                  onChange={(e) => setNewImg(e.target.value)}
                  placeholder="Enlace https:// o dejar vacío para foto estándar"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Disponibilidad Inmediata</span>
                  <span className="text-[10px] text-slate-500">¿Habilitar en el catálogo de estudiantes?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNewAvailable(!newAvailable)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                    newAvailable ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                      newAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-blue-700 hover:bg-blue-800 text-white shadow-md transition"
                >
                  Publicar en Menú
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
