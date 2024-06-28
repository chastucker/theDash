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
import { getGetGetPatientsQueryKey, usePostAddPatient } from "generated_client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

import { Datepicker } from "flowbite-react";

const STATUS_OPTIONS = ["Active", "Churned", "Inquiry", "Onboarding"];

const formSchema = z.object({
  firstName: z.string().min(2),
  middleName: z.string(),
  lastName: z.string().min(2),
  dateOfBirth: z.date(),
  status: z.string(),
  addresses: z
    .array(
      z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      })
    )
    .min(1),
});

export function AddPatientForm({ closeModal }: { closeModal: () => void }) {
  const addPatient = usePostAddPatient();
  const queryClient = useQueryClient();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("pressed submit");
    await addPatient.mutateAsync({
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
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
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: new Date(),
      status: "",
      addresses: [
        {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
      ],
    },
  });

  const addressesArray = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  return (
    <FormProvider {...form}>
      <form className="space-y-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input placeholder="Apple" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Datepicker
                value={field.value.toLocaleDateString()}
                onSelectedDateChanged={(date) => field.onChange(date)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
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
                  {STATUS_OPTIONS.map((type) => (
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

        {addressesArray.fields.map((_, index) => (
          <div key={index}>
            <FormField
              control={form.control}
              name={`addresses.${index}.street`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`addresses.${index}.city`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`addresses.${index}.state`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`addresses.${index}.zip`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-4"
              onClick={() => addressesArray.remove(index)}
              type="button"
            >
              remove
            </Button>
          </div>
        ))}
        <Button
          className="mt-4"
          onClick={() =>
            addressesArray.append({
              street: "",
              city: "",
              state: "",
              zip: "",
            })
          }
          type="button"
        >
          Add addresses
        </Button>
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
