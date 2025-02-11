"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useGetVariations } from "@/features/variation/api/use-get-variations"
import { useProjectConfigStore } from "@/features/variation/store/use-project-config"
import { generateSKU } from "@/lib/generate-sku"
import { generateVariationCombinations } from "@/lib/generate-variation"

import useCreateProductItem from "../api/use-create-product-item"
import { type configurationsSchema, createProductItemSchema } from "../schemas"

export const CreateProductItem = () => {
  const { data } = useGetVariations()
  const { productId } = useProjectConfigStore()
  const combinations = generateVariationCombinations(data || [])
  const [isSelected, setIsSelected] = useState<number | null>(null)
  const [selectedVariation, setSelectedVariation] = useState<z.infer<typeof configurationsSchema>>([])
  const { mutate: createProductItem } = useCreateProductItem()

  const form = useForm<z.infer<typeof createProductItemSchema>>({
    resolver: zodResolver(createProductItemSchema),
    defaultValues: {
      price: "",
      qtyInStock: "",
    },
  })
  function onSubmit(values: z.infer<typeof createProductItemSchema>) {
    if (!productId) {
      toast.error("Please select a product first")
      return
    }
    if (!selectedVariation.length) {
      toast.error("Please select a variation first")
      return
    }
    const finalValues = {
      ...values,
      configurations: selectedVariation,
      productId: productId,
      sku: generateSKU(productId),
    }
    createProductItem({ json: finalValues }, {
      onSuccess: () => {
        form.reset()
        setIsSelected(null)
        setSelectedVariation([])
      }
    })
  }

  const handleSelectVariation = (variation: z.infer<typeof configurationsSchema>) => {
    setSelectedVariation(variation)
  }


  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {
          combinations.map((item, index) => {
            return (
              <div key={index} className={`flex flex-row border p-2 rounded-md cursor-pointer ${isSelected === index ? "bg-blue-500" : ""}`} onClick={() => {
                const configurations: z.infer<typeof configurationsSchema> = []
                Object.entries(item).forEach(([, value]) => {
                  configurations.push({
                  variationId: value.variationId,
                  variationOptionId: value.id,
                })
              })
              handleSelectVariation(configurations)
              setIsSelected(index)
            }}>
              {Object.entries(item).map(([key, value], index) => (
                <span key={key}>
                  {value.value}
                  {index !== Object.entries(item).length - 1 && <span>-</span>}
                </span>
              ))}
            </div>
            )
          })
        }
      </div>
      <div className="flex">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col gap-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qtyInStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qty In Stock</FormLabel>
                  <FormControl>
                    <Input placeholder="Qty In Stock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div >
  )
}
