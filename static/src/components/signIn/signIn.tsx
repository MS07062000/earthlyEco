import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/AuthContext';
import Error from '../ErrorMessage';
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
      navigate("/")
    } catch (error) {
      setErrorMessage("Error in signin with Email and Password");
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await authFunctions?.signInWithGoogle();
      navigate("/")
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
              <Error errorMessage={errorMessage} />
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

              <button type="submit" className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">Sign in</button>

              <p className="text-sm font-medium text-black">
                <span>Don’t have an account yet ?</span><a href="/signUp" className="font-medium text-blue-600 hover:underline"> Sign up</a>
              </p>
            </form>
            <button type="button" onClick={handleGoogleLogin} className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2">
              <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd" />
              </svg>
              Sign in with Google
            </button>

          </div>
        </div>
      </div>
    </section>

  )
}

export default SignIn;