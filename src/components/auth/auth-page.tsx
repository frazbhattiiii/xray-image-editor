
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "./user-auth-form";

export default function AuthenticationPage({
  title,
  description,
  value,
  authFor,
}: {
  title: string;
  description: string;
  value: string;
  authFor: string;
}) {
  return (
    <>
      <div className="container relative  grid h-[800px] flex-col items-center justify-center">
        <Link
          to={value === "Login" ? "/login" : "/signup"}
          className={cn(
            buttonVariants({ variant: "primary" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          {value}
        </Link>
        
        <div className="-mt-44">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="p-4 text-xs text-muted-foreground sm:p-0 sm:text-sm">
                {description}
              </p>
            </div>
            <UserAuthForm authFor={authFor} />
            <p className="px-4 text-center text-xs text-muted-foreground sm:px-8 sm:text-sm">
              By clicking continue, you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
