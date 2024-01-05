import { AuthContextProvider } from "../context/AuthContext"
import Navbar from '../components/Navbar/navbar';
import AddressForm from "../components/addressForm/addressForm";

const AddAddressFormPage = () => {
  return (
    <AuthContextProvider>
      <Navbar />
      <AddressForm isAdd={true}/>
    </AuthContextProvider>
  )
}

export default AddAddressFormPage;