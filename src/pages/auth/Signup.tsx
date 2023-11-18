import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationPage from "@/components/auth/auth-page";
import { Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      // Redirect to the home page if logged in
      navigate("/list-patients");
    }
  }, [navigate]);
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
        description="Enter your details to create an account"
        value="Login"
        authFor="signup"
      />
    </div>
  );
};

export default SignUp;
