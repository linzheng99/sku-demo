import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useGetProducts = () => {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await client.api.product['list']['$get']()

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    }
  })
  return query
}
