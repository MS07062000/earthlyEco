import { Navbar, AddressForm } from "../components";
import { useLocation } from "react-router-dom";

const EditAddressFormPage = () => {
    const location = useLocation();
    const { address } = location.state;
    return (
        <>
            <Navbar />
            <AddressForm isAdd={false} editAddressInfo={address} />
        </>
    )
}

export default EditAddressFormPage;