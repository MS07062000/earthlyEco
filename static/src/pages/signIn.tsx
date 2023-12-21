import { AuthContextProvider } from "../context/AuthContext"
import SignIn from '../components/signIn/signIn';

const SignInPage = () => {
  return (
    <AuthContextProvider>
      <SignIn />
    </AuthContextProvider>
  )
}

export default SignInPage