import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";

interface ForgotPasswordProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function UpdatePassword({
  className,
  ...props
}: ForgotPasswordProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const password = (event.target as HTMLFormElement).password.value;
    if (!password) {
      toast.error("Please enter password");
      setIsLoading(false);
      return;
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Toaster />
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Enter new password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button
            disabled={isLoading}
            className={cn(buttonVariants({ variant: "primary" }))}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  );
}
