import { create } from 'zustand';

interface ProductStoreProps {
  productId: string;
  setProductId: (productId: string) => void
}

export const useProductStore = create<ProductStoreProps>()((set) => ({
  productId: "",
  setProductId: (productId: string) => set({ productId }),
}))
