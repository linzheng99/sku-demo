import { useMutation } from "@tanstack/react-query";
import { type InferRequestType, type InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.productItem['$post'], 200>
type RequestType = InferRequestType<typeof client.api.productItem['$post']>


export default function useCreateProductItem() {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.productItem['$post']({ json })

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Product item created successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
