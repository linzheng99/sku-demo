import { useSuspenseQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useGetProduct = (id: string) => {
  const query = useSuspenseQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await client.api.product[':id']['$get']({ param: { id } })

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    }
  })
  return query
}
