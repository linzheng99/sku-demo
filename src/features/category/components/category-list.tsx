"use client"

import { TrashIcon } from "lucide-react";

import { useGetCategories } from "../api/use-categories";
import useDeleteCategory from "../api/use-delete-category";

export default function CategoryList() {
  const { data } = useGetCategories()
  const { mutate: deleteCategory } = useDeleteCategory()

  function handleDeleteCategory(categoryId: string) {
    deleteCategory(categoryId)
  }

  return (
    <div className="flex gap-2">
      {data?.map((category) => <div key={category.id} className="bg-gray-800 p-2 rounded-md relative">
        <div className="flex items-center gap-2">
          {category.name}
          <TrashIcon className="w-4 h-4" onClick={() => handleDeleteCategory(category.id)} />
        </div>
      </div>)}
    </div>
  )
}
