import { AuthContextProvider } from "../context/AuthContext"
import Navbar from '../components/Navbar/navbar';
import AddressForm from "../components/addressForm/addressForm";
import { useLocation } from "react-router-dom";

const EditAddressFormPage = () => {
    const location = useLocation();
    const { address } = location.state;
    return (
        <AuthContextProvider>
            <Navbar />
            <AddressForm isAdd={false} editAddressInfo={address}/>
        </AuthContextProvider>
    )
}

export default EditAddressFormPage;