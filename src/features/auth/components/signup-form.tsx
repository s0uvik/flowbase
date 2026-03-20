"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { createAuthClient } from "better-auth/client";

const signupFormSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    password: z.string().min(6, "Password is required"),
    confirmPassword: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });
type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupForm() {
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const authClient = createAuthClient();
  const signInWithGithub = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onSuccess: () => {
          router.push("/workflows");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  };
  const signInWithGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onSuccess: () => {
          router.push("/workflows");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  };
  const onSubmit = async (data: SignupFormValues) => {
    await authClient.signUp.email(
      {
        name: data.email,
        email: data.email,
        password: data.password,
        callbackURL: "/workflows",
      },
      {
        onSuccess: () => {
          router.push("/workflows");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Welcome to{" "}
            <Link href="/" className=" text-primary font-semibold font-mono">
              Flowbase
            </Link>
          </CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className=" grid gap-6">
                <div className=" flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={isPending}
                    onClick={signInWithGoogle}
                  >
                    <Image
                      src="/icons/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Sign up with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={isPending}
                    onClick={signInWithGithub}
                  >
                    <Image
                      src="/icons/github.svg"
                      alt="Github"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Sign up with Github
                  </Button>
                </div>
                <div className=" grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} />
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
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="confirmPassword"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    Signup
                  </Button>
                </div>
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className=" text-blue-600 underline underline-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
