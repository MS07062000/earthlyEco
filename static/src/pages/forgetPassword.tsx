import { AuthContextProvider } from "../context/AuthContext";
import ForgetPassword from '../components/forgetPassword/forgetPassword';

const ForgetPasswordPage = () => {
  return (
    <AuthContextProvider>
      <ForgetPassword/>
    </AuthContextProvider>
  )
}

export default ForgetPasswordPage