"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
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
  GetGetPatients200CustomFieldsItem,
  usePostCustomField,
  usePostCustomFieldDelete,
  usePutCustomField,
} from "generated_client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { useToast } from "components/ui/use-toast";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  defaultValue: z.string(),
});

const TYPES_OPTIONS = ["text", "boolean", "date"];

export function AddEditCustomFieldForm({
  closeModal,
  customFields,
}: {
  closeModal: () => void;
  customFields: GetGetPatients200CustomFieldsItem[];
}) {
  const addCustomField = usePostCustomField();
  const editCustomField = usePutCustomField();
  const deleteCustomField = usePostCustomFieldDelete();
  const { toast } = useToast();

  const deleteCustomFieldById = async (id: string) => {
    try {
      await deleteCustomField.mutateAsync({
        data: {
          id,
        },
      });
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: getGetGetPatientsQueryKey(),
      });
      toast({
        title: "Column Deleted Successfully",
      });
    } catch {
      toast({
        title: "Error Deleting Column",
        variant: "destructive",
      });
    }
  };

  const queryClient = useQueryClient();
  const onEditSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await editCustomField.mutateAsync({
        data: {
          ...data,
          id: data.id,
          defaultValue:
            data.defaultValue.trim() === "" ? undefined : data.defaultValue,
        },
      });
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: getGetGetPatientsQueryKey(),
      });
      toast({
        title: "Column Updated Successfully",
      });
    } catch {
      toast({
        title: "Error Updating Column",
        variant: "destructive",
      });
    }
  };

  const onAddSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await addCustomField.mutateAsync({
        data: {
          ...data,
          defaultValue:
            data.defaultValue.trim() === "" ? null : data.defaultValue,
        },
      });

      closeModal();
      await queryClient.invalidateQueries({
        queryKey: getGetGetPatientsQueryKey(),
      });
      toast({
        title: "Column Added Successfully",
      });
    } catch {
      toast({
        title: "Error Adding Column",
        variant: "destructive",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "text",
      defaultValue: "",
    },
  });

  const addOrEditOptions =
    customFields.map((field) => {
      return {
        name: field.name,
        id: field.id,
      };
    }) ?? [];

  addOrEditOptions.unshift({ name: "Add New Value", id: "new_value" });

  const onIdSelectChange = (id: string) => {
    if (id === "new_value") {
      form.setValue("id", "new_value");
      form.setValue("name", "");
      form.setValue("type", "text");
      form.setValue("defaultValue", "");
    } else {
      const field = customFields.find((field) => field.id === id);
      if (field) {
        form.setValue("id", field.id);
        form.setValue("name", field.name);
        form.setValue("type", field.type);
        form.setValue("defaultValue", field.defaultValue ?? "");
      }
    }
  };
  const id = form.watch("id");

  const isPending =
    addCustomField.isPending ||
    editCustomField.isPending ||
    deleteCustomField.isPending;

  return (
    <FormProvider {...form}>
      <form className="space-y-2">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Select existing column name or add a new one
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  onIdSelectChange(value);
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Add or edit a column" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {addOrEditOptions.map(({ id, name }) => (
                    <SelectItem key={name} value={id}>
                      {name}
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
        {id === "new_value" ? (
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
        ) : (
          <></>
        )}
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
        {id !== "new_value" && (
          <Button
            disabled={id === "new_value" || id === ""}
            className="mt-4"
            onClick={() => deleteCustomFieldById(id)}
            type="submit"
          >
            Delete
          </Button>
        )}
        <Button
          className="mt-4"
          onClick={
            id === "new_value"
              ? form.handleSubmit(onAddSubmit)
              : form.handleSubmit(onEditSubmit)
          }
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting" : "Submit"}
        </Button>
        <Button className="mt-4" onClick={closeModal} type="button">
          Close
        </Button>
      </div>
    </FormProvider>
  );
}
