import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType, type InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.product['$post'], 200>
type RequestType = InferRequestType<typeof client.api.product['$post']>


export default function useCreateProduct() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.product['$post']({ json })

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Product created successfully')

      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
