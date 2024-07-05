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
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { usePostSignIn, usePostSignUp } from "generated_client";
import { useRouter } from "next/navigation";

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

  const form = useForm<AuthForm>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (authForm: AuthForm) => {
    const { refresh_token, access_token } = await signIn.mutateAsync({
      data: authForm,
    });

    if (access_token && refresh_token) {
      setCookies(access_token, refresh_token);
      router.push("/");
    }
  };

  const handleSignUp = async (authForm: AuthForm) => {
    const { refresh_token, access_token } = await signUp.mutateAsync({
      data: authForm,
    });

    if (refresh_token && access_token) {
      setCookies(access_token, refresh_token);
      router.push("/");
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
              <Button onClick={form.handleSubmit(handleSignIn)} type="button">
                Sign in
              </Button>
            </div>
            <div>
              <Button onClick={form.handleSubmit(handleSignUp)} type="button">
                Sign up
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
