import AuthenticationPage from "@/components/auth/auth-page";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-5">
      <div className="flex justify-center items-center m-5 gap-4">
        <Link to="/">
          <h1 className="text-4xl font-semibold">
            Xray {""}
            <span className="text-red-500">Editor</span>
          </h1>
        </Link>
      </div>
      <AuthenticationPage
        title="Sign Up"
        description="Enter your email below to create your account"
        value="Login"
        authFor="signup"
      />
    </div>
  );
};

export default SignUp;
