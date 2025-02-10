import { useMutation } from "@tanstack/react-query";
import { type InferRequestType, type InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.variation['$post'], 200>
type RequestType = InferRequestType<typeof client.api.variation['$post']>


export default function useCreateVariation() {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.variation['$post']({ json })

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
