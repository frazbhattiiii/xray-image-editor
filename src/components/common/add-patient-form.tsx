import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import axios from "axios";
import { Toaster ,toast} from "react-hot-toast";

// Gender options
const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Intersex", value: "intersex" },
] as const;

// Zod schema for patient form validation
const patientFormSchema = z.object({
  patientId: z.string().min(2, {
    message: "Patient Id must be at least 2 characters",
  }),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.string({
    required_error: "Please select patient's gender",
  }),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

// Default values (can be fetched from an API or database)
const defaultValues: Partial<PatientFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
};

// Props type definition
type AddPatientFormProps = {
  onPatientAdded: () => void;  // The function type for onPatientAdded
};

// AddPatientForm component
export function AddPatientForm({ onPatientAdded }: AddPatientFormProps) {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues,
  });

  const apiKey = import.meta.env.VITE_BASE_URL;

  async function onSubmit(data: PatientFormValues) {
    try {
      // Wait for the axios post request to complete
      await axios.post(`${apiKey}/patients/addPatient`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      form.reset();
      toast.success("Patient Added Successfully");

      setTimeout(() => {
        onPatientAdded(); // Call the function passed as a prop
      }, 1000);
      
    } catch (error) {
      console.error(error);
      // Handle error (show error toast or message)
    }
  }

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PatientId</FormLabel>
              <FormControl>
                <Input placeholder="Enter Patient Id" {...field} />
              </FormControl>
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
                <Input placeholder="Enter Patient Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Gender</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? gender.find((gen) => gen.value === field.value)?.label
                        : "Select Gender"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Select Gender of Patient" />
                    <CommandEmpty>No Gender found.</CommandEmpty>
                    <CommandGroup>
                      {gender.map((gen) => (
                        <CommandItem
                          value={gen.label}
                          key={gen.value}
                          onSelect={() => {
                            form.setValue("gender", gen.value);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              gen.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {gen.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-red-500 hover:bg-red-600 w-full ">
          Add Patient
        </Button>
      </form>
    </Form>
  );
}
