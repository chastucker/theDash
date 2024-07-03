"use client";

import React from "react";
import {
  ControllerRenderProps,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
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
  useGetGetPatients,
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
  customFields: z.array(
    z.object({
      customFieldId: z.string(),
      customFieldName: z.string(),
      value: z.string(),
    })
  ),
});

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

    await editPatient.mutateAsync({
      data: {
        id: patient.id,
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
        customFields: dataCustomFields,
      },
    });
    await queryClient.invalidateQueries({
      queryKey: getGetGetPatientsQueryKey(),
    });
    closeModal();
  };

  const onAddSubmit = async (data: z.infer<typeof formSchema>) => {
    const dataCustomFields = data.customFields.map((field) => {
      return {
        id: field.customFieldId,
        value: field.value,
      };
    });

    await addPatient.mutateAsync({
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
        customFields: dataCustomFields,
      },
    });
    await queryClient.invalidateQueries({
      queryKey: getGetGetPatientsQueryKey(),
    });
    closeModal();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
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

        <div className="py-4">
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
                  className="mt-4"
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
        {customFields.sort().map((customField, index) => (
          <FormField
            key={customField.id}
            control={form.control}
            name={`customFields.${index}.value`}
            render={({ field }) => (
              <CustomInput
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
          className="mt-4"
          onClick={
            patient
              ? form.handleSubmit(onEditSubmit)
              : form.handleSubmit(onAddSubmit)
          }
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

function getDefaultValues(
  patient: GetGetPatients200PatientsItem | undefined,
  customFields: GetGetPatients200CustomFieldsItem[]
) {
  const defaultValues: z.infer<typeof formSchema> = {
    firstName: patient?.firstName ?? "",
    middleName: patient?.middleName ?? "",
    lastName: patient?.lastName ?? "",
    dateOfBirth: patient?.dateOfBirth
      ? new Date(patient.dateOfBirth)
      : new Date(),
    status: patient?.status ?? "",
    addresses: patient?.addresses ?? [
      {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
    ],
    customFields: [],
  };

  if (!patient) {
    for (const field of customFields) {
      defaultValues.customFields.push({
        customFieldId: field.id,
        customFieldName: field.name,
        value: field.defaultValue ?? "",
      });
    }
  } else {
    patient.patientCustomFields.forEach((field) => {
      const customField = customFields.find(
        (cf) => cf.id === field.customFieldId
      );

      if (customField && customField.type === "date") {
        const date =
          field.value &&
          new Date(field.value) instanceof Date &&
          !isNaN(new Date(field.value).getTime())
            ? new Date(field.value)
            : new Date();

        defaultValues.customFields.push({
          customFieldId: customField.id,
          customFieldName: customField.name,
          value: date.toString(),
        });
      } else {
        if (customField) {
          defaultValues.customFields.push({
            customFieldId: customField.id,
            customFieldName: customField.name,
            value: field.value ?? "",
          });
        }
      }
    });
  }

  return defaultValues;
}

function CustomInput({
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
