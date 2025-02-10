import { type Variation } from '@prisma/client';
import { create } from 'zustand';

interface ProjectConfigStoreProps {
  productId: string;
  variations: Variation[];
  setProductId: (productId: string) => void
  setVariations: (variations: Variation[]) => void
}

export const useProjectConfigStore = create<ProjectConfigStoreProps>()((set) => ({
  productId: "",
  variations: [],
  setProductId: (productId: string) => set({ productId }),
  setVariations: (variations: Variation[]) => set({ variations }),
}))
