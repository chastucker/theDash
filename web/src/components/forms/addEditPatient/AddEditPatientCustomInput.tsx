"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Datepicker } from "flowbite-react";
import { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Input } from "components/ui/input";

export function AddEditPatientCustomInput({
  field,
  type,
  name,
}: {
  field: ControllerRenderProps<
    z.infer<typeof formSchema>,
    `customFields.${number}.value`
  >;
  type: string;
  name: string;
}) {
  if (type === "date") {
    const onChange = (date: Date) => {
      field.onChange(date.toString());
    };

    return (
      <FormItem className="flex flex-col">
        <FormLabel>{name}</FormLabel>
        <Datepicker
          value={new Date(field.value).toLocaleDateString()}
          onSelectedDateChanged={onChange}
        />
        <FormMessage />
      </FormItem>
    );
  }

  if (type === "boolean") {
    return (
      <FormItem>
        <FormLabel>{name}</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select the type" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {["true", "false"].map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    );
  }

  return (
    <FormItem>
      <FormLabel>{name}</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
