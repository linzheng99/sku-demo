"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useCreateCategory from "../api/use-create-category";

export default function CreateCategory() {
  const { mutate: createCategory } = useCreateCategory()
  const [name, setName] = useState('')

  function handleCreateCategory() {
    createCategory({ json: { name } })
    setName('')
  }

  return (
    <div className="flex gap-2 w-[280px]">
      <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
      <Button variant="default" onClick={handleCreateCategory}>
        <PlusIcon className="w-4 h-4" />
      </Button>
    </div>
  )
}
