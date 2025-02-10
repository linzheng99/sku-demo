"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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

import useCreateVariation from "../api/use-create-variation"
import { createVariationsSchema } from "../schemas"

export const CreateVariation = () => {
  const { mutate } = useCreateVariation()
  const form = useForm<z.infer<typeof createVariationsSchema>>({
    resolver: zodResolver(createVariationsSchema),
    defaultValues: {
      variations: [{ name: "", options: [{ value: "" }], required: true }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variations",
  })

  const onSubmit = (data: z.infer<typeof createVariationsSchema>) => {
    mutate({ json: data })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border rounded-md p-4 w-full">
        <div className="grid grid-cols-2 gap-4">
          {fields.map((field, variationIndex) => (
            <div key={field.id} className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name={`variations.${variationIndex}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Variation Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                {form.watch(`variations.${variationIndex}.options`).map((_, optionIndex) => (
                  <div key={optionIndex} className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name={`variations.${variationIndex}.options.${optionIndex}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Option</FormLabel>
                          <FormControl>
                            <Input placeholder="Option" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        const currentOptions = form.getValues(`variations.${variationIndex}.options`);
                        if (currentOptions.length > 1) {
                          const newOptions = [...currentOptions];
                          newOptions.splice(optionIndex, 1);
                          form.setValue(`variations.${variationIndex}.options`, newOptions);
                        }
                      }}
                      disabled={form.watch(`variations.${variationIndex}.options`).length === 1}
                    >
                      Remove Option
                    </Button>
                  </div>
                ))}
                <div className="col-span-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const currentOptions = form.getValues(`variations.${variationIndex}.options`);
                      form.setValue(
                        `variations.${variationIndex}.options`,
                        [...currentOptions, { value: "" }]
                      );
                    }}
                  >
                    Add Option
                  </Button>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(variationIndex)}
                disabled={fields.length === 1}
              >
                Remove Variation
              </Button>
            </div>
          ))}
          <div className="col-span-2">
            <Button
              type="button"
              onClick={() => append({ name: "", options: [{ value: "" }], required: true })}
            >
              Add Variation
            </Button>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
