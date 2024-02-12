import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signUpWithEmailAndPassword } from '../../store/actions/authActions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Button, Icon, Message } from '..';

type SignUpField = "email" | "password" | "confirmPassword";

const SignUp = () => {
  const { auth } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [signUpFormData, setSignUpFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUpFormDataChange = (signUpField: SignUpField, e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpFormData((prevFormData) => ({
      ...prevFormData,
      [signUpField]: e.target.value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(signUpWithEmailAndPassword(signUpFormData.email, signUpFormData.password, signUpFormData.confirmPassword));
  }

  const handleGoogleSignUp = async () => {
    dispatch(signInWithGoogle());
  }

  useEffect(() => {
    if (auth.user != null) {
      navigate("/", { replace: true });
    }
  }, [auth])

  return (
    <section className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border-solid border-black border-2">
          <div className="p-6 space-y-4 md:space-y-4 sm:p-8">
            <a href="/" className="flex mr-4">
              <img src="/logo.png" className="h-12 w-12 mr-3" alt="Earthly Eco Shop Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap ">Earthly Eco</span>
            </a>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
              Create a account
            </h1>
            {
              auth.errorMessage &&
              <Message type="error" message={auth.errorMessage} />
            }
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Email</label>
                <input
                  type="email"
                  placeholder="xyz@gmail.com"
                  value={signUpFormData.email}
                  onChange={(e) => handleSignUpFormDataChange("email", e)}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={signUpFormData.password}
                  onChange={(e) => handleSignUpFormDataChange("password", e)}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-black">Confirm password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={signUpFormData.confirmPassword}
                  onChange={(e) => handleSignUpFormDataChange("confirmPassword", e)}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
              </div>
              <Button type='submit' isTextVisible={true} text="Create an account" buttonClass='w-full mr-2 mb-2 px-5 py-2.5 text-sm' />
              <p className="text-sm font-medium">
                Already have an account? <a href="/signIn" className="font-bold text-blue-700 hover:underline"> Sign in</a>
              </p>
            </form>
            <Button text="Sign up with Google" isTextVisible={true} icon={<Icon type="google" iconClass="h-4 w-4 mr-2" />} buttonClass="w-full text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center justify-center" onClick={handleGoogleSignUp} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUp;