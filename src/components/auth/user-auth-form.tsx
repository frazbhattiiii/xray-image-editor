import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  authFor: string;
}

export function UserAuthForm({
  className,
  authFor,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [, setPassword] = React.useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    setPassword(password);

    if (!email || !password) {
      toast.error("Please enter all fields");
      setIsLoading(false);
      return;
    }
    // validating the password
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      setIsLoading(false);
      return;
    }
    // also making sure the password is strong
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regex.test(password)) {
      toast.error(
        "Password should be at least 8 characters, one uppercase, one lowercase and one number"
      );
      setIsLoading(false);
      return;
    }
    console.log(email, password);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Toaster />
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            <div className="relative">
              <Input
                id="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                className="mt-2"
              />
              <button
                type="button"
                className="absolute mt-2 inset-y-0 right-0 pr-3 flex items-center bg-transparent text-black cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeOffIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button
            disabled={isLoading}
            className={cn(buttonVariants({ variant: "primary" }))}
            type="submit"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {authFor == "signup" ? "Sign up with Email" : "Login with Email"}
          </Button>
        </div>
      </form>

      {authFor == "login" ? (
        <Link to="/forgot-password">
          <div className="text-sm text-center text-muted-foreground hover:underline">
            Forgot password?
          </div>
        </Link>
      ) : null}
    </div>
  );
}
