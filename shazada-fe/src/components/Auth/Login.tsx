"use client";

import { Input } from "@base-ui/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthSchema } from "./validation";
import { useMounted } from "@/hooks/useMounted";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { loginAction, TLogin } from "@/app/actions/auth";
import EcommerceBgPattern from "../custom-ui/EcommerceBgPattern";
type ErrorProps = {
  email?: string[];
  password?: string[];
};
const LoginIndex = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TLogin>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [openPass, setOpenPass] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorProps>({});

  const handleSubmit = async (data: TLogin) => {
    const result = AuthSchema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await loginAction(data);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      router.refresh();
      toast.success("Login berhasil");
    } catch (error: any) {
      console.log("Error login: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;

    const timer = setTimeout(() => {
      setErrors({});
    }, 4000);

    return () => clearTimeout(timer);
  }, [errors]);

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

  return (
    <section className="min-h-screen w-full flex items-center relative justify-center">
      <div className="absolute left-0 top-0 w-full h-full">
        <EcommerceBgPattern />
      </div>
      <Card className="sm:max-w-[30%] max-w-[80%] w-full z-50">
        <CardHeader>
          <h4 className="text-xl font-semibold text-muted-foreground text-center">
            Welcome
          </h4>

          <p className="text-center text-sm text-foreground font-mono">
            Log in to your acccount
          </p>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex flex-col gap-4">
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
                placeholder="Masukkan email . . ."
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
                  placeholder="Masukkan password . . ."
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
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] text-foreground">
              Don't have an account?{" "}
            </p>
            <p
              onClick={() => router.push("/auth/register")}
              className="underline hover:text-muted-foreground cursor-pointer"
            >
              sign Up
            </p>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export default LoginIndex;
