import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/AuthContext';
import Message from '../Message';
import Icon from '../Icon';
import Button from '../Button';
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { authFunctions } = useUserAuth();


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match");
      return;
    }

    try {
      await authFunctions?.registerWithEmailAndPassword(email, password);
      navigate('/', { replace: true })
    } catch (error) {
      setErrorMessage("Error in registering user");
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      await authFunctions?.signInWithGoogle();
      navigate("/")
    } catch (error) {
      setErrorMessage("Error in google signup");
    }

  }

  return (
    <section className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border-solid border-black border-2">
          <div className="p-6 space-y-4 md:space-y-4 sm:p-8">
            <a href="/" className="flex mr-4">
              <img src="/logo.png" className="h-12  mr-3" alt="Earthly Eco Shop Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap ">Earthly Eco</span>
            </a>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
              Create and account
            </h1>
            {
              errorMessage &&
              <Message type="error" message={errorMessage} />
            }
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Your email</label>
                <input
                  type="email"
                  placeholder="xyz@gmail.com"
                  value={email}
                  onChange={handleEmailChange}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-black">Confirm password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
              </div>
              <Button type='submit' isTextVisible={true} text="Create an account" buttonClass='w-full mr-2 mb-2 px-5 py-2.5 text-sm' />
              <p className="text-sm font-medium">
                Already have an account? <a href="/signIn" className="font-medium text-blue-600 hover:underline"> Sign in</a>
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