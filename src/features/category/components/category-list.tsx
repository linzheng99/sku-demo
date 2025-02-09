"use client"

import { TrashIcon } from "lucide-react";

import useDeleteCategory from "../api/use-delete-category";
import { useGetCategories } from "../api/use-get-categories";

export default function CategoryList() {
  const { data } = useGetCategories()
  const { mutate: deleteCategory } = useDeleteCategory()

  function handleDeleteCategory(categoryId: string) {
    deleteCategory(categoryId)
  }

  if (!data) return null

  return (
    <div className="flex gap-2">
      {data?.map((category) => <div key={category.id} className="border p-2 rounded-md relative">
        <div className="flex items-center gap-2">
          {category.name}
          <TrashIcon className="w-4 h-4 cursor-pointer" onClick={() => handleDeleteCategory(category.id)} />
        </div>
      </div>)}
    </div>
  )
}
