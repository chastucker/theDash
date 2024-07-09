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
  GetGetPatients200CustomFieldsItem,
  GetGetPatients200PatientsItem,
  usePostAddPatient,
  usePutUpdatePatient,
} from "generated_client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

import { Datepicker } from "flowbite-react";
import { formSchema, STATUS_OPTIONS } from "./constants";
import { AddEditPatientCustomInput } from "./AddEditPatientCustomInput";
import { getDefaultValues } from "./getDefaultValues";
import { useToast } from "components/ui/use-toast";
import { Spinner } from "components/ui/spinner";

export function AddEditPatientForm({
  closeModal,
  customFields,
  patient,
}: {
  closeModal: () => void;
  customFields: GetGetPatients200CustomFieldsItem[];
  patient?: GetGetPatients200PatientsItem | undefined;
}) {
  const editPatient = usePutUpdatePatient();
  const addPatient = usePostAddPatient();
  const queryClient = useQueryClient();
  const defaultValues = getDefaultValues(patient, customFields);
  const { toast } = useToast();

  const onEditSubmit = async (data: z.infer<typeof formSchema>) => {
    if (patient === undefined) {
      return;
    }

    const dataCustomFields = data.customFields.map((field) => {
      return {
        id: field.customFieldId,
        value: field.value,
      };
    });

    const addresses = data.addresses.filter(
      (address) => address.city.trim() !== ""
    );
    try {
      await editPatient.mutateAsync({
        data: {
          id: patient.id,
          ...data,
          addresses,
          dateOfBirth: data.dateOfBirth.toISOString(),
          customFields: dataCustomFields,
        },
      });
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: getGetGetPatientsQueryKey(),
      });
      toast({
        title: "Patient Updated Successfully",
      });
    } catch {
      toast({
        title: "Error Updating Patient",
        variant: "destructive",
      });
    }
  };

  const onAddSubmit = async (data: z.infer<typeof formSchema>) => {
    const dataCustomFields = data.customFields.map((field) => {
      return {
        id: field.customFieldId,
        value: field.value,
      };
    });

    const addresses = data.addresses.filter(
      (address) => address.city.trim() !== ""
    );
    try {
      await addPatient.mutateAsync({
        data: {
          ...data,
          addresses,
          dateOfBirth: data.dateOfBirth.toISOString(),
          customFields: dataCustomFields,
        },
      });
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: getGetGetPatientsQueryKey(),
      });
      toast({
        title: "Patient Added Successfully",
      });
    } catch {
      toast({
        title: "Error Adding Patient",
        variant: "destructive",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const addressesArray = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const isPending = addPatient.isPending || editPatient.isPending;

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
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the Status" />
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

        <div className="py-4 space-y-4">
          {addressesArray.fields.map((_, index) => (
            <div key={index} className="border p-3 rounded-xl">
              <div className="justify-center flex">
                <p>Address {index + 1}</p>
              </div>
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
              <div className="flex justify-end">
                <Button
                  className="mt-4 bg-red-500 text-white hover:bg-red-600"
                  onClick={() => addressesArray.remove(index)}
                  type="button"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
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
        {customFields.sort().map((customField, index) => (
          <FormField
            key={customField.id}
            control={form.control}
            name={`customFields.${index}.value`}
            render={({ field }) => (
              <AddEditPatientCustomInput
                name={customField.name}
                field={field}
                type={customField.type}
              />
            )}
          />
        ))}
      </form>
      <div className="flex flex-row justify-between">
        <Button
          className="mt-4 bg-green-500 text-white hover:bg-green-600"
          onClick={
            patient
              ? form.handleSubmit(onEditSubmit)
              : form.handleSubmit(onAddSubmit)
          }
          type="submit"
          disabled={isPending}
        >
          {isPending ? <Spinner size="small" /> : "Submit"}
        </Button>
        <Button
          className="mt-4 bg-indigo-500 text-white hover:bg-indigo-600"
          onClick={closeModal}
          type="button"
          disabled={isPending}
        >
          Close
        </Button>
      </div>
    </FormProvider>
  );
}
