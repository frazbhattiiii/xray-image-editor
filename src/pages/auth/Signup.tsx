import AuthenticationPage from "@/components/auth/auth-page";

const SignUp = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-5">
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
