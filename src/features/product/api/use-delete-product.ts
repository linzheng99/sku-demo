import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

export default function useDeleteCategory() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await client.api.product[':productId']['$delete']({ param: { productId } })

      if (!response.ok) {
        throw new Error('delete product failed...')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Product deleted successfully')
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  return mutation
};

