import { useEffect, useState } from 'react';
import { forgetPassword } from '../../store/actions/authActions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { Button, Message } from '..';
const ForgetPassword = () => {
  const { auth } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(forgetPassword(email));
  }

  useEffect(() => {
    if (auth.user === null) {
      navigate('/signIn');
    }
  }, [auth])

  return (
    <section className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border-solid border-2 border-black ">
          <div className="p-6 space-y-4 md:space-y-4 sm:p-8">
            <a href="/" className="flex mr-4">
              <img src="/logo.png" className="h-12 w-12 mr-3" alt="Earthly Eco Shop Logo" />
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
                {auth.errorMessage != null && <Message type="error" message={auth.errorMessage} />}
                {auth.successMessage!= null && <Message type="success" message={auth.successMessage} />}
                <Button type="submit" text="Continue" isTextVisible={true} buttonClass='w-full w-full mr-2 mb-2 px-5 py-2.5 text-sm' />
              </div>
            </form>
            <p className="text-sm font-medium text-primary-600 hover:underline">
              <span>Don't have an account yet?</span><a href="/signUp" className="font-bold text-blue-700 hover:underline"> Sign up </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgetPassword;