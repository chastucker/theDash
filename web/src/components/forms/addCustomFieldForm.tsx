"use client";

import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import {
  getGetGetPatientsQueryKey,
  usePostCustomField,
} from "generated_client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

const formSchema = z.object({
  name: z.string(),
  type: z.string(),
  defaultValue: z.string(),
});

const TYPES_OPTIONS = ["text", "boolean", "date"];

export function AddCustomFieldForm({ closeModal }: { closeModal: () => void }) {
  const addCustomField = usePostCustomField();
  const queryClient = useQueryClient();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await addCustomField.mutateAsync({
      data: {
        ...data,
        defaultValue:
          data.defaultValue.trim() === "" ? null : data.defaultValue,
      },
    });
    await queryClient.invalidateQueries({
      queryKey: getGetGetPatientsQueryKey(),
    });
    closeModal();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "text",
      defaultValue: "",
    },
  });

  return (
    <FormProvider {...form}>
      <form className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TYPES_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Value</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <div className="flex flex-row justify-between">
        <Button
          className="mt-4"
          onClick={form.handleSubmit(onSubmit)}
          type="submit"
        >
          Submit
        </Button>
        <Button className="mt-4" onClick={closeModal} type="button">
          Close
        </Button>
      </div>
    </FormProvider>
  );
}
