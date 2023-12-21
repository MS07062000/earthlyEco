import { useState } from 'react';
// import '../../css/additional-styles/signInSignUp.css';
import { useUserAuth } from '../../context/AuthContext';
import Error from '../ErrorMessage';
import SuccessMessage from '../SuccessMessage';
const ForgetPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [successMessage, setSucessMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { authFunctions } = useUserAuth();
  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const message = await authFunctions?.sendPasswordReset(email);
      if (message && typeof message === 'string' && message !== '') {
        setSucessMessage(message); 
      } 
    } catch (error) {
      setError("Error in sending password reset link");
    };
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-full h-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-4 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Forget Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter the email address associated with your account and we'll send you a link to reset your password.</label>
                <input type="email" placeholder="Email" value={email}
                  onChange={handleEmailChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                  required />
                {error != null && <Error error={error} />}
                {successMessage.length > 0 && <SuccessMessage successMessage={successMessage} />}
                <button className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center  dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
                  Continue
                </button>
              </div>
            </form>
            <p className="text-sm font-medium dark:text-white text-primary-600 hover:underline dark:text-primary-500">
              <span>Don’t have an account yet?</span><a href="/signUp" className="font-medium text-blue-600 hover:underline dark:text-blue-500"> Sign up </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgetPassword;