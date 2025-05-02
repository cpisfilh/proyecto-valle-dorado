import { create } from 'zustand';
import { getPagos } from '@/requests/reqPagos';
import { getClientes } from '@/requests/reqClientes';
import { getPrediosSelectModal } from '@/requests/reqPredios';

const usePaymentsStore = create((set, get) => ({
  pagos: [],
  shouldReloadPagos: false,
  setShouldReloadPagos: (value) => set({ shouldReloadPagos: value }),
  clientes: [],
  predios: [],

  fetchPagos: async () => {
    if (get().pagos.length) return; // evitar doble llamada
    const res = await getPagos();
    set({ pagos: res.data });
  },

  fetchClientes: async () => {
    if (get().clientes.length) return;
    const res = await getClientes();
    set({ clientes: res.data });
  },

  fetchPredios: async () => {
    if (get().predios.length) return;
    const res = await getPrediosSelectModal();
    set({ predios: res.data });
  },
}));

export default usePaymentsStore;