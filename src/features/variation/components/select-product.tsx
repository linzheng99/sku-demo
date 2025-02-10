"use client"

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetProducts } from "@/features/product/api/use-get-products";

import { useProjectConfigStore } from "../store/use-project-config";

export function SelectProduct() {
  const { data } = useGetProducts()
  const store = useProjectConfigStore()

  if (!data) return null

  return (
    <RadioGroup defaultValue="comfortable" className="flex gap-2 border p-4 rounded-md">
      {data.map((product) => (
        <div className="flex items-center space-x-2 cursor-pointer" key={product.id} onClick={() => {
          store.setProductId(product.id)
        }}>
          <RadioGroupItem value={product.id} id={product.id} />
          <Label htmlFor={product.id}>{product.name}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}
