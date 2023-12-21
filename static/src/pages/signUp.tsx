import { AuthContextProvider } from "../context/AuthContext"
import SignUp from '../components/signUp/signUp';

const SignUpPage = () => {
  return (
    <AuthContextProvider>
      <SignUp />
    </AuthContextProvider>
  )
}

export default SignUpPage;