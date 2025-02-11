"use client"

import { TrashIcon } from "lucide-react";

import useDeleteProduct from "../api/use-delete-product";
import { useGetProducts } from "../api/use-get-products";
import { useProductStore } from "../store/use-product";

export default function ProductList() {
  const { data } = useGetProducts()
  const { mutate: deleteProduct } = useDeleteProduct()
  const { setProductId } = useProductStore()

  function handleDeleteProduct(productId: string) {
    deleteProduct(productId)
  }

  function handleSelectProduct(productId: string) {
    setProductId(productId)
  }

  if (!data) return null

  return (
    <div className="flex gap-2">
      {data?.map((product) => <div key={product.id} className="cursor-pointer border p-2 rounded-md relative" onClick={() => handleSelectProduct(product.id)}>
        <div className="flex items-center gap-2">
          {product.name}
          <TrashIcon className="w-4 h-4 cursor-pointer" onClick={(e) => {
            e.preventDefault()
            handleDeleteProduct(product.id)
          }} />
        </div>
      </div>)}
    </div>
  )
}
