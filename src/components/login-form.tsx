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

const loginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginFormValues) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      }
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="p-4 flex justify-center items-center h-screen border">
      <Card className="w-full md:w-1/3 max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back to Flowbase</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
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
                  >
                    Sign in with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={isPending}
                  >
                    Sign in with Github
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
                  <Button type="submit" className="w-full" disabled={isPending}>
                    Login
                  </Button>
                </div>
                <p className="text-center text-sm">
                  Don't have account?{" "}
                  <Link
                    href="/signup"
                    className=" text-blue-600 underline underline-offset-2"
                  >
                    Sign up
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
