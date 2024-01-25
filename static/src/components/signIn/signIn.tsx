import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/AuthContext';
import Message from '../Message';
import Icon from '../Icon';
import Button from '../Button';
const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { authFunctions } = useUserAuth();

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await authFunctions?.logInWithEmailAndPassword(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage("Error in signin with Email and Password");
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await authFunctions?.signInWithGoogle();
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage("Error in google signin");
    }

  }

  return (
    <section className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 border-solid border-2 border-black">
          <div className="p-6 space-y-4 md:space-y-4 sm:p-8">
            <a href="/" className="flex mr-4">
              <img src="/logo.png" className="h-12 mr-3" alt="Earthly Eco Shop Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap ">Earthly Eco</span>
            </a>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
              Sign in to your account
            </h1>
            {
              errorMessage &&
              <Message type="error" message={errorMessage} />
            }
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Your email</label>
                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder='xyz@gmail.com'
                  value={email} onChange={handleEmailChange} required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black ">Password</label>
                <input type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  name="password"
                  id="password"
                  onChange={handlePasswordChange}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
              </div>
              <div>
                <a href="/forgetPassword" className="text-sm text-blue-600 font-medium text-primary-600 hover:underline">Forgot password?</a>
              </div>
              <Button type='submit' text="Sign in" isTextVisible={true} buttonClass='w-full mr-2 mb-2 px-5 py-2.5 text-sm' />
              <p className="text-sm font-medium text-black">
                <span>Don’t have an account yet ?</span><a href="/signUp" className="font-medium text-blue-600 hover:underline"> Sign up</a>
              </p>
            </form>
            <Button text="Sign in with Google" icon={<Icon type="google" iconClass="h-4 w-4 mr-2" />} buttonClass="w-full text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center justify-center" isTextVisible={true} onClick={handleGoogleLogin} />
          </div>
        </div>
      </div>
    </section>

  )
}

export default SignIn;