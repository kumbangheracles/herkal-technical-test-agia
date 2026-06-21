"use client";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { registerAction, TRegister } from "@/app/actions/auth";
import { Skeleton } from "../ui/skeleton";
import { useMounted } from "@/hooks/useMounted";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import EcommerceBgPattern from "../custom-ui/EcommerceBgPattern";
import { toast } from "sonner";
import { RegisterSchema } from "./validation";
import { motion } from "framer-motion";
type ErrorProps = {
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
  username?: string[];
  full_name?: string[];
};
const RegisterIndex = () => {
  const [formData, setFormData] = useState<TRegister>({
    confirmPassword: "",
    email: "",
    full_name: "",
    password: "",
    username: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [openPass, setOpenPass] = useState<boolean>(false);
  const [openConfirmPass, setOpenConfirmPass] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorProps>({});
  const searchParams = useSearchParams();
  const handleSubmit = async (data: TRegister) => {
    const result = RegisterSchema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Password did not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerAction(data);
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      router.push("/auth/register?activation=true");
      toast.success("Registration success.");
    } catch (error: any) {
      console.log("Error login: ", error);
    } finally {
      setLoading(false);
    }
  };

  const mounted = useMounted();
  if (!mounted)
    return (
      <section className="min-h-screen w-full flex items-center justify-center">
        <Card className="sm:max-w-1/3 max-w-[80%] w-full">
          <CardHeader>
            <Skeleton className="h-6 w-32 mx-auto" />
          </CardHeader>

          <Separator />

          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-3xl" />
                <Skeleton className="h-3 w-40" />
              </div>

              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-3xl" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </CardFooter>
        </Card>
      </section>
    );

  if (searchParams.has("successActivation")) {
    setTimeout(() => {
      router.push("/auth/login");
    }, 2500);
    return (
      <section className="min-h-screen w-full flex items-center justify-center relative">
        <div className="absolute left-0 top-0 w-full h-full">
          <EcommerceBgPattern />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-full flex items-center justify-center w-full"
        >
          <div className="w-full max-w-[80%] text-center font-mono">
            <h4 className="text-5xl font-semibold text-foreground">
              Activation Succcess You'll be redirect to home page.
            </h4>
          </div>
        </motion.div>
      </section>
    );
  }

  if (searchParams.has("activation"))
    return (
      <section className="min-h-screen w-full flex items-center justify-center relative">
        <div className="absolute left-0 top-0 w-full h-full">
          <EcommerceBgPattern />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-full flex items-center justify-center w-full"
        >
          <div className="w-full max-w-[80%] text-center font-mono">
            <h4 className="text-5xl font-semibold text-foreground">
              Registration Success, Check your email for activation
            </h4>
          </div>
        </motion.div>
      </section>
    );

  return (
    <section className="min-h-screen w-full flex items-center justify-center relative">
      <div className="absolute left-0 top-0 w-full h-full">
        <EcommerceBgPattern />
      </div>
      <Card className="sm:max-w-[30%] max-w-[80%] w-full z-50">
        <CardHeader>
          <h4 className="text-xl font-semibold text-muted-foreground text-center">
            Welcome to Shazada
          </h4>

          <p className="text-center text-sm text-foreground font-mono">
            Create an account
          </p>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-start flex-col max-w-full gap-3">
              <label className="font-semibold text-muted-foreground">
                Full Name
              </label>
              <Input
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    full_name: e.target.value,
                  })
                }
                className="p-4 outline-none h-8 w-full text-[12px] rounded-3xl border border-border focus:bg-muted/40 bg-muted transition-colors"
                placeholder="Input Full Name . . ."
              />
              {errors.full_name?.[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.full_name[0]}
                </p>
              )}
            </div>
            <div className="flex w-full items-start flex-col max-w-full gap-3">
              <label className="font-semibold text-muted-foreground">
                Username
              </label>
              <Input
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
                className="p-4 outline-none h-8 w-full text-[12px] rounded-3xl border border-border focus:bg-muted/40 bg-muted transition-colors"
                placeholder="Input Username . . ."
              />
              {errors.username?.[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username[0]}
                </p>
              )}
            </div>
            <div className="flex w-full items-start flex-col max-w-full gap-3">
              <label className="font-semibold text-muted-foreground">
                Email
              </label>
              <Input
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="p-4 outline-none h-8 w-full text-[12px] rounded-3xl border border-border focus:bg-muted/40 bg-muted transition-colors"
                placeholder="Input email . . ."
              />
              {errors.email?.[0] && (
                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
              )}
            </div>
            <div className="flex w-full items-start flex-col gap-2">
              <label className="font-semibold text-muted-foreground">
                Password
              </label>
              <div className="flex items-center justify-between gap-3 w-full relative max-w-full">
                <Input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  type={openPass ? "password" : "text"}
                  className="p-4 outline-none h-8 w-full max-w-[85%] text-[12px] rounded-3xl border border-border focus:bg-muted/40 bg-muted transition-colors"
                  placeholder="Input password . . ."
                />
                {!openPass ? (
                  <Eye
                    className="absolute right-0 sm:right-2 z-20 cursor-pointer"
                    onClick={() => setOpenPass(true)}
                  />
                ) : (
                  <EyeClosed
                    className="absolute right-0 sm:right-2 z-20 cursor-pointer"
                    onClick={() => setOpenPass(false)}
                  />
                )}
              </div>
              {errors.password?.[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password[0]}
                </p>
              )}
            </div>
            <div className="flex w-full items-start flex-col gap-2">
              <label className="font-semibold text-muted-foreground">
                Confirm Password
              </label>
              <div className="flex items-center justify-between gap-3 w-full relative max-w-full">
                <Input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  type={openConfirmPass ? "password" : "text"}
                  className="p-4 outline-none h-8 w-full max-w-[85%] text-[12px] rounded-3xl border border-border focus:bg-muted/40 bg-muted transition-colors"
                  placeholder="Input confirmPassword . . ."
                />
                {!openConfirmPass ? (
                  <Eye
                    className="absolute right-0 sm:right-2 z-20 cursor-pointer"
                    onClick={() => setOpenConfirmPass(true)}
                  />
                ) : (
                  <EyeClosed
                    className="absolute right-0 sm:right-2 z-20 cursor-pointer"
                    onClick={() => setOpenConfirmPass(false)}
                  />
                )}
              </div>
              {errors.confirmPassword?.[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword[0]}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="-my-1.5 flex flex-col gap-2">
          <div className="flex items-center justify-between w-full">
            {/* <Button onClick={() => router.push("/")} className="text-[12px]">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <ArrowLeft /> Back
                </>
              )}
            </Button> */}
            <Button
              className="text-sm tracking-wide w-full uppercase font-semibold"
              onClick={() => handleSubmit(formData)}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] text-foreground">
              Already have an account?{" "}
            </p>
            <p
              onClick={() => router.push("/auth/login")}
              className="underline hover:text-muted-foreground cursor-pointer"
            >
              sign In
            </p>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export default RegisterIndex;
