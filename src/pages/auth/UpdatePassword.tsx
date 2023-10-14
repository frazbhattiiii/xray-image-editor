import UpdatePassword from "@/components/auth/update-password";
import { Link } from "react-router-dom";

const UpdatePasswordPage = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-5">
      <div className=" flex items-center justify-center pt-20">
        <Link to="/">
          <h1 className="text-4xl font-semibold">
            Xray {""}
            <span className="text-red-500">Editor</span>
          </h1>
        </Link>
      </div>
      <div className="px-5 py-20">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Update Password{" "}
            </h1>
            <p className="p-4 text-xs text-muted-foreground sm:p-0 sm:text-sm">
              Enter your new password below.
            </p>
          </div>
          <UpdatePassword />
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
