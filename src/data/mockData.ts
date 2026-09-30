import { ProductItem, Order, PastOrder, StudentProfile } from '../types';

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: 'Almuerzo Ejecutivo IUSH',
    category: 'almuerzos',
    price: 14500,
    description: 'Plato del día, proteína (pechuga/res), arroz, ensalada fresca, fríjol, patacón y sopa caliente.',
    portions: 45,
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDif3leshu7SB92-yGEPSxEU3fteK3wUcSvAown-5E4CzcknG3mmQH4dxFYwn34B_0PGVYtMVmRtNWEstCAa4aXEDc8wLyKNVh9M1jRO_KMqmFnKcbOWZYtpD5g-CSD8SUA6OHkyh9BlzNaziaQBh16x1fgBIm94hBvSMyawddL4RRLlnveWtYxCUtHs9Bw12hvn3-3t1wrxMZHqnnTu4XMTUwuVDBgfjm-S3Wsfoa8RUinw-sRD9uGpw',
  },
  {
    id: '2',
    name: 'Empanada de Carne con Ají',
    category: 'snacks',
    price: 3200,
    description: 'Masa de maíz crocante rellena de carne tierna desmechada con ají de la casa.',
    portions: 80,
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAil3_pgt-QDoVH6DF3FwigqiRSU0Wmwubsu6z8Ygk0ufpbq-7-xq4cs3hfToZbnl7DP8jKMJyqZkCogiYsLUW0wPWJmcwKCj052HVjfkpvo_47ZaTloiLj-uhhUJJcPNt_7Lc4BTemkl99uWlz1g7j1jzsy39JtIY_W9EJv_YsGRka-pgYnK7Y-AckZf5nLDurlGRnUcTK_D0NR87WhgTaVUwp8coxtyCVvzPHRD1QsbWbpBRPEY7ivw',
  },
  {
    id: '3',
    name: 'Capuchino Artesanal IUSH',
    category: 'bebidas',
    price: 4800,
    description: 'Café especial de origen antioqueño con leche cremada y arte latte.',
    portions: 32,
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6ajBGWIHj6_1R3bmNG3014panYOt-MRVm_DV1u6_PBNKOFfSdTJ555gkFO-aH6WZcJdIyTwPG9IyNXcJTwcFaOTs3osni3VeCvUPxHcjXeKIK8jZrKn8TfSi-t0MJsbjl3NTb2OBC5vQ3uX7UAvaPpuMVTjBoLOfCpSXxEiwVUocJx1r2Mz4uYNuauiE96PnDkCm0m0FPkt7NbEVR1FC_mDR2Dbl4G94KE5RNoanVd186JECXSG1_Ug',
  },
  {
    id: '4',
    name: 'Pastel de Pollo Hojaldrado',
    category: 'snacks',
    price: 4000,
    description: 'Hojaldre mantequilla con pechuga campesina desmechada y suave sazón.',
    portions: 0,
    available: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjagt2gibI5fB6m71T6-Bkh24l2q64y4D76Ga-ZTChRxvCVJpy2LbzmMmdliP1S3fp_kthx0nZ9N7h7RI0_XEb0vUH6fiP9SGZk1RWMSZyX8rkfoTGexZSsuL6qKIm_8B_nsqoBceskfRsMtj0h4bvQAQjO-xqqhz9dxTn9z63o1rEUb2nnaQX40Og-VHQs-_RGTol8RNg0wdXOzD1J4jcOyHssVprCm5PNiguIoDa-MREnT0dfJFyWQ',
  },
  {
    id: '5',
    name: 'Jugo Natural en Agua / Leche',
    category: 'bebidas',
    price: 4500,
    description: 'Mora, maracuyá, guanábana, lulo o mango batido al momento.',
    portions: 50,
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzdUPbkzPxqdQFU7hhOqeT1LYkk7F0fUbDeQNch5zCPDub8NKKVtAH-TApLReOzVtXFE21McmgRx5D1kJz3Y6Cza1KjD_xMG78eR2DHOljGpO1oO7XR9CP9zChLTcnyc7RQ_vnuGQqnwx6Vno_ib2EBUgLou1-C4V7FAd-NfW2KunbfR2tZeVWrNgd4Vj06ZJRzy8WAmWvJJL9LuTBt1e99UAPwMQPe1HZ4HGjg2Dkopq0Nd08w3GXWg',
  },
  {
    id: '6',
    name: 'Combo Salazarista (Snack + Bebida)',
    category: 'promos',
    price: 6500,
    description: 'Snack crocante a elección + Bebida fría o café caliente. ¡Ahorra más en tu pausa!',
    portions: 25,
    available: true,
    isPromo: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh_sx6J5KU9srCOqvOoK1jrHwU_jBf8REx62ojy0t67RvGqpbzjIEEdp9cXrohIVF3cI7SKMrPD45NVi9SIAJA2xSHYDfSOyNYoadBIRXKpIX1RGi4jcYj7D2mZe_KbMHGJ-MbEtwGE66TxheYBi9R6cKJ5O2_i1xu3WQBnjtFM4qIo6viZP_OZ-l5TVl3UKGxX0xf8uX-D15CNtQJFi7KNWdNacRfXp50XgsSezq-X-0qNhttwKvDuA',
  },
  {
    id: '7',
    name: 'Copa de Frutas Tropicales con Granola',
    category: 'desayunos',
    price: 6000,
    description: 'Papaya, fresa, melón, queso rallado campesino, granola y miel de abejas.',
    portions: 18,
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyTviKl9SxwPkJ387LufY1FF0HxypCHMXSVrhHAKFODWjuqRHmfEkWu2sOXlAc6bGSnQ_da1rl1pPzcyxa5_mL-jaj8b1K3h9YC3MyaWY3mSPAnun-wsd-Ubgk9wYyBs4rzKThJdIEbKEcovdrJ0fbrDn21t0S4mnHRZmYlCRNJYNYbSMe0f84_Z9cFjZqfmVw2ba85qgkMKb_e6kHMg17Ssm24S4ZrxRJnWBJXyU_WV4enBvaJzdSPg',
  },
  {
    id: '8',
    name: 'Sándwich Especial de Pollo',
    category: 'snacks',
    price: 9500,
    description: 'Pechuga a la plancha, queso derretido, lechuga romana, tomate y aderezo especial.',
    portions: 15,
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALdhi2IGWIinr3E4lPMjqXfit0HDmrmhub6N_lybfV3GHeTA2xrENnBwvIlRT7aLe06ItwtqDjg3EnUWWWUEhpZkHmIj3AbBhMl_0tFQzpTpvcUe5njTNXdA51rUpEYPDsYRik71amF2-ZREWyFU0OxapvaIauqvMQ5_hEAbiTWi6I8vaUM5KKxVMzp6pEs_vC8Tnn-N2RC5Q_nudKETaXacdlOsBOysYKZTKXHSlUY7IJ7FuiBKnoTA',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2048',
    studentName: 'Santiago G.',
    studentProgram: 'Ingeniería de Sistemas • Semestre 6',
    timestamp: '10:15 AM',
    items: [
      {
        name: 'Almuerzo Ejecutivo IUSH',
        quantity: 1,
        price: 14500,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDif3leshu7SB92-yGEPSxEU3fteK3wUcSvAown-5E4CzcknG3mmQH4dxFYwn34B_0PGVYtMVmRtNWEstCAa4aXEDc8wLyKNVh9M1jRO_KMqmFnKcbOWZYtpD5g-CSD8SUA6OHkyh9BlzNaziaQBh16x1fgBIm94hBvSMyawddL4RRLlnveWtYxCUtHs9Bw12hvn3-3t1wrxMZHqnnTu4XMTUwuVDBgfjm-S3Wsfoa8RUinw-sRD9uGpw',
        notes: 'Pechuga asada, arroz, fríjol, patacón'
      },
      {
        name: 'Jugo Natural de Maracuyá',
        quantity: 1,
        price: 4500,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzdUPbkzPxqdQFU7hhOqeT1LYkk7F0fUbDeQNch5zCPDub8NKKVtAH-TApLReOzVtXFE21McmgRx5D1kJz3Y6Cza1KjD_xMG78eR2DHOljGpO1oO7XR9CP9zChLTcnyc7RQ_vnuGQqnwx6Vno_ib2EBUgLou1-C4V7FAd-NfW2KunbfR2tZeVWrNgd4Vj06ZJRzy8WAmWvJJL9LuTBt1e99UAPwMQPe1HZ4HGjg2Dkopq0Nd08w3GXWg',
        notes: 'En agua, sin azúcar añadida'
      }
    ],
    note: 'Salsa de ají aparte por favor.',
    paymentMethod: 'Saldo IUSH',
    total: 19000,
    status: 'preparando',
    estimatedTime: '12 - 15 min',
    approxTime: 'Aprox: 10:30 AM',
    pickupCounter: 'Mostrador Principal - Bloque Central (Ventanilla #2)'
  },
  {
    id: 'ORD-2049',
    studentName: 'Mateo Arango',
    studentProgram: 'Diseño Gráfico • Semestre 4',
    timestamp: '10:29 AM',
    items: [
      { name: 'Empanadas de Carne Crispy', quantity: 2, price: 3000 },
      { name: 'Jugo Hit Mango 350ml', quantity: 1, price: 3200 }
    ],
    note: 'Ají aparte por favor',
    paymentMethod: 'Saldo IUSH',
    total: 9200,
    status: 'preparando',
    estimatedTime: '6 - 10 min'
  },
  {
    id: 'ORD-2050',
    studentName: 'Camila Osorio',
    studentProgram: 'Administración de Empresas • Semestre 8',
    timestamp: '10:18 AM',
    items: [
      { name: 'Bowl de Frutas con Granola', quantity: 1, price: 7800 },
      { name: 'Botella de Agua Cristal 600ml', quantity: 1, price: 2500 }
    ],
    note: 'Sin miel',
    paymentMethod: 'Daviplata',
    total: 10300,
    status: 'listo',
    estimatedTime: '¡Listo para reclamar!'
  },
  {
    id: 'ORD-2051',
    studentName: 'David Echeverri',
    studentProgram: 'Derecho • Semestre 3',
    timestamp: '10:32 AM',
    items: [
      { name: 'Pastel de Pollo y Champiñones', quantity: 1, price: 4800 },
      { name: 'Café Tinto Campesino', quantity: 1, price: 2000 }
    ],
    paymentMethod: 'Nequi',
    total: 6800,
    status: 'preparando',
    estimatedTime: '5 min'
  },
  {
    id: 'ORD-2052',
    studentName: 'Mateo Calle',
    studentProgram: 'Comunicación Social • Semestre 5',
    timestamp: '10:35 AM',
    items: [
      { name: 'Empanadas de Pollo Caseras', quantity: 2, price: 3000 },
      { name: 'Té Helado Limón 400ml', quantity: 1, price: 3500 }
    ],
    paymentMethod: 'Saldo IUSH',
    total: 9500,
    status: 'pendiente',
    estimatedTime: '15 min'
  }
];

export const PAST_ORDERS: PastOrder[] = [
  {
    id: 'ORD-1984',
    summary: '2x Empanadas de Carne + Tinto Campesino',
    date: 'Ayer, 03:40 PM',
    total: 5800,
    status: 'Entregado',
    items: [
      { name: 'Empanada de Carne con Ají', quantity: 2, price: 2900 },
      { name: 'Café Tinto Campesino', quantity: 1, price: 0 }
    ]
  },
  {
    id: 'ORD-1910',
    summary: '1x Sándwich Gourmet Jamón y Queso + Capuchino',
    date: 'Lun, 24 Feb',
    total: 11200,
    status: 'Entregado',
    items: [
      { name: 'Sándwich Especial de Pollo', quantity: 1, price: 9500 }
    ]
  }
];

export const INITIAL_USER: StudentProfile = {
  name: 'Santiago G.',
  email: 'santiago.gomez@soyiush.edu.co',
  program: 'Ingeniería de Sistemas',
  semester: 'Semestre 6',
  balance: 45000,
};

export function formatCOP(amount: number): string {
  return '$' + amount.toLocaleString('es-CO') + ' COP';
}

export function playAudioFeedback(freq = 660, duration = 0.12) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio error if browser blocks autoplay
  }
}
