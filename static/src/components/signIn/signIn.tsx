import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Icon, Message } from "..";
import { useAppDispatch, useAppSelector } from "../../store/hooks/apphook";
import {
  loginWithEmailAndPassword,
  signInWithGoogle,
} from "../../store/actions/authActions";

type SignInField = "email" | "password" | "confirmPassword";

const SignIn = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignInFormDataChange = (
    signInField: SignInField,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSignInFormData((prevFormData) => ({
      ...prevFormData,
      [signInField]: e.target.value,
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    dispatch(
      loginWithEmailAndPassword(signInFormData.email, signInFormData.password)
    );
  };

  const handleGoogleLogin = async () => {
    dispatch(signInWithGoogle());
  };

  useEffect(() => {
    if (auth.user !== null) {
      navigate("/", { replace: true });
    }
  }, [auth.user]);

  return (
    <section className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full md:mt-0 sm:max-w-md xl:p-0 rounded-lg shadow-[-10px_10px_20px_#d7b34d,10px_-10px_20px_#fff369]">
          <div className="p-6 space-y-4 md:space-y-4 sm:p-8">
            <a href="/" className="flex mr-4">
              <img
                src="/logo.png"
                className="h-12 w-12 mr-3"
                alt="Earthly Eco Shop Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap ">
                Earthly Eco
              </span>
            </a>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
              Sign in
            </h1>
            {auth.errorMessage && (
              <Message type="error" message={auth.errorMessage} />
            )}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-base font-medium text-black"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="signInEmail"
                  placeholder="xyz@gmail.com"
                  value={signInFormData.email}
                  onChange={(e) => handleSignInFormDataChange("email", e)}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-base font-medium text-black "
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name="password"
                  id="signInPassword"
                  value={signInFormData.password}
                  onChange={(e) => handleSignInFormDataChange("password", e)}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <a
                  href="/forgetPassword"
                  className="text-base text-blue-600 font-medium text-primary-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Button
                type="submit"
                id="signInButton"
                text="Sign in"
                isTextVisible={true}
                buttonClass="w-full mr-2 mb-2 px-5 py-2.5 text-base"
              />
              <p className="text-base font-medium text-black">
                <span>Don’t have an account yet ?</span>
                <a
                  href="/signUp"
                  className="font-bold text-blue-700 hover:underline"
                >
                  {" "}
                  Sign up
                </a>
              </p>
            </form>
            <Button
              text="Sign in with Google"
              id="signInWithGoogle"
              icon={<Icon type="google" iconClass="h-4 w-4 mr-2" />}
              buttonClass="w-full text-base px-5 py-2.5 mr-2 mb-2 inline-flex items-center justify-center"
              isTextVisible={true}
              onClick={handleGoogleLogin}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
