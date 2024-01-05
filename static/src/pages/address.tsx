import { AuthContextProvider } from "../context/AuthContext"
import Navbar from '../components/Navbar/navbar';
import Address from "../components/address/address";

const AddressPage = () => {
  return (
    <AuthContextProvider>
      <Navbar />
      <Address />
    </AuthContextProvider>
  )
}

export default AddressPage;