import { z } from "zod";

export const STATUS_OPTIONS = ["Active", "Churned", "Inquiry", "Onboarding"];
export const formSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string(),
  lastName: z.string().min(1, "Last Name is required"),
  dateOfBirth: z.date({ message: "Date of birth is required" }),
  status: z.string().min(1, "Status is required"),
  addresses: z.array(
    z.object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z.string().min(1, "Zip Code is required"),
    })
  ),
  customFields: z.array(
    z.object({
      customFieldId: z.string(),
      customFieldName: z.string(),
      value: z.string(),
    })
  ),
});
