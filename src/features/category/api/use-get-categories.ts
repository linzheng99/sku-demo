import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await client.api.category['list']['$get']()

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    }
  })
  return query
}
