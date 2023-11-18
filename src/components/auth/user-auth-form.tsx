import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_BASE_URL;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string): boolean => {
    // Regular expression to check if the password has at least 6 characters and contains both alphabets and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
  
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    const firstName = authFor=="signup"?(event.target as HTMLFormElement).firstName.value:'';
    const lastName = authFor=="signup"?(event.target as HTMLFormElement).lastName.value:'';
    setPassword(password);
  
    if (!email || !password) {
      toast.error("Please enter all fields");
      setIsLoading(false);
      return;
    }
  
    if (authFor === "signup" && (!firstName || !lastName)) {
      toast.error("Please enter all fields");
      setIsLoading(false);
      return;
    }
  
    if (!validatePassword(password)) {
      toast.error(
        "Password should be exactly 6 characters and contain at least one alphabet and one number"
      );
      setIsLoading(false);
      return;
    }
  
    try {
      let authValue = "";
      let navigateTo = "";
  
      if (authFor === "signup") {
        authValue = "register";
        const response = await axios.post(`${apiKey}/auth/${authValue}`, {
          firstName,
          lastName,
          email,
          password,
          role: "USER",
        });
  
        const { access_token, refresh_token } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        setIsLoading(false);
        toast.success("Successfully Signed up");
        (event.target as HTMLFormElement).firstName.value = "";
        (event.target as HTMLFormElement).lastName.value = "";
        (event.target as HTMLFormElement).email.value = "";
        (event.target as HTMLFormElement).password.value = "";
        navigateTo = "/list-patients";
      } else {
        authValue = "authenticate";
        const response = await axios.post(`${apiKey}/auth/${authValue}`, {
          email,
          password,
        });
  
        const { access_token, refresh_token } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        setIsLoading(false);
        toast.success("Successfully logged in");
        (event.target as HTMLFormElement).email.value = "";
        (event.target as HTMLFormElement).password.value = "";
        navigateTo = "/list-patients";
      }
  
      // Use navigate hook to redirect
     
      navigate(navigateTo);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Some error occurred");
    }
  }
  

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Toaster />
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            {authFor == "signup" ? (
              <Input
                id="firstName"
                placeholder="first name"
                type="text"
                autoCapitalize="none"
                autoComplete="firstName"
                autoCorrect="off"
                disabled={isLoading}
              />
            ) : null}
            {authFor == "signup" ? (
              <Input
                id="lastName"
                placeholder="last name"
                type="text"
                autoCapitalize="none"
                autoComplete="lastName"
                autoCorrect="off"
                disabled={isLoading}
              />
            ) : null}
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
