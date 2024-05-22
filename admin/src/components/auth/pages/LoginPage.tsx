"use client";

import { CardWrapper } from "@/components/auth/template/CardWrapper";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/schemas";
import FormError from "../atoms/FormError";
import FormSuccess from "../atoms/FormSuccess";
import { loginWithEmailAndPassword } from "@/store/actions/authActions";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/apphook";

const LoginForm: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    dispatch(
      loginWithEmailAndPassword(
        form.getValues().email,
        form.getValues().password
      )
    );
  };

  useEffect(() => {
    if (auth.user !== null) {
      navigate("/products", { replace: true });
    }
  }, [auth]);

  return (
    <CardWrapper
      headerLabel="Welcome back!"
      // backButtonLabel="Don't have an account?"
      // backButtonHref="/signup"
      // showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                        placeholder="example@gexample.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        {...field}
                        placeholder="********"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          {auth.errorMessage!=null && <FormError message={auth.errorMessage} />}
          {auth.successMessage!=null && <FormSuccess message={auth.successMessage} />}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;