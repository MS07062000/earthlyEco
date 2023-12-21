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
    <section className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border-solid border-2 border-black ">
          <div className="p-6 space-y-4 md:space-y-4 sm:p-8">
            <a href="/" className="flex mr-4">
              <img src="/logo.png" className="h-12  mr-3" alt="Earthly Eco Shop Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap ">Earthly Eco</span>
            </a>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">Forget Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Enter the email address associated with your account and we'll send you a link to reset your password.</label>
                <input type="email" placeholder="Email" value={email}
                  onChange={handleEmailChange}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mb-4"
                  required />
                {error != null && <Error errorMessage={error} />}
                {successMessage.length > 0 && <SuccessMessage successMessage={successMessage} />}
                <button className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2">
                  Continue
                </button>
              </div>
            </form>
            <p className="text-sm font-medium text-primary-600 hover:underline">
              <span>Don’t have an account yet?</span><a href="/signUp" className="font-medium text-blue-600 hover:underline"> Sign up </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgetPassword;