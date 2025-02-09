import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

export default function useDeleteCategory() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await client.api.category[':categoryId']['$delete']({ param: { categoryId } })

      if (!response.ok) {
        throw new Error('delete category failed...')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Category deleted successfully')
      void queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  return mutation
};

