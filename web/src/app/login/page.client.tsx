"use client";

import React, { useState } from "react";
import { FormProvider, set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { usePostSignIn, usePostSignUp } from "generated_client";
import { useRouter } from "next/navigation";
import { Spinner } from "components/ui/spinner";
import { useToast } from "components/ui/use-toast";

export type AuthForm = z.infer<typeof authFormSchema>;

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function Login({
  setCookies,
}: {
  setCookies: (accessToken: string, refreshToken: string) => Promise<void>;
}) {
  const router = useRouter();
  const signIn = usePostSignIn();
  const signUp = usePostSignUp();
  const [isPendingForm, setIsPendingForm] = useState(false);
  const { toast } = useToast();

  const form = useForm<AuthForm>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (authForm: AuthForm) => {
    try {
      setIsPendingForm(true);
      const { refresh_token, access_token } = await signIn.mutateAsync({
        data: authForm,
      });

      if (access_token && refresh_token) {
        setCookies(access_token, refresh_token);
        router.push("/");
      }
    } catch {
      toast({
        title: "Error Signing In",
        variant: "destructive",
      });
    } finally {
      setIsPendingForm(false);
    }
  };

  const handleSignUp = async (authForm: AuthForm) => {
    try {
      setIsPendingForm(true);
      const { refresh_token, access_token } = await signUp.mutateAsync({
        data: authForm,
      });

      if (refresh_token && access_token) {
        setCookies(access_token, refresh_token);
        router.push("/");
      }
    } catch {
      toast({
        title: "Error Signing Up",
        variant: "destructive",
      });
    } finally {
      setIsPendingForm(false);
    }
  };

  return (
    <div className="items-center">
      <FormProvider {...form}>
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@test.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex-row flex justify-between">
            <div>
              <Button
                disabled={isPendingForm}
                onClick={form.handleSubmit(handleSignIn)}
                type="button"
              >
                {isPendingForm ? <Spinner size="small" /> : "Sign in"}
              </Button>
            </div>
            <div>
              <Button
                disabled={isPendingForm}
                onClick={form.handleSubmit(handleSignUp)}
                type="button"
              >
                {isPendingForm ? <Spinner size="small" /> : "Sign up"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
