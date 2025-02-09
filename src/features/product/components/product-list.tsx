"use client"

import { TrashIcon } from "lucide-react";

import useDeleteProduct from "../api/use-delete-product";
import { useGetProducts } from "../api/use-get-products";

export default function ProductList() {
  const { data } = useGetProducts()
  const { mutate: deleteProduct } = useDeleteProduct()

  function handleDeleteProduct(productId: string) {
    deleteProduct(productId)
  }

  if (!data) return null

  return (
    <div className="flex gap-2">
      {data?.map((product) => <div key={product.id} className="border p-2 rounded-md relative">
        <div className="flex items-center gap-2">
          {product.name}
          <TrashIcon className="w-4 h-4 cursor-pointer" onClick={() => handleDeleteProduct(product.id)} />
        </div>
      </div>)}
    </div>
  )
}
