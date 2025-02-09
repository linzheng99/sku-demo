import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType, type InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.category['$post'], 200>
type RequestType = InferRequestType<typeof client.api.category['$post']>


export default function useCreateCategory() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.category['$post']({ json })

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Category created successfully')

      void queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
