import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useGetVariations = () => {
  const query = useQuery({
    queryKey: ['variations'],
    queryFn: async () => {
      const response = await client.api.variation['list']['$get']()

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    }
  })
  return query
}
