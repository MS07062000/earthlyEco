import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/AuthContext";
import { addressCard } from "../address/address";
import { deleteAddress } from "./helpers/deleteAddress";
import { editAddress } from "../addressForm/helpers/editAddress";

const AddressCard = ({ addressInfo, defaultAddress }: { addressInfo: addressCard, defaultAddress: addressCard | null }) => {
    const { user } = useUserAuth();
    const navigate = useNavigate();
    const handleEdit = () => {
        if (user != null) {
            navigate('/editAddress', { state: { address: addressInfo } });
        }
    }

    const handleDelete = async () => {
        if (user != null) {
            await deleteAddress(user.uid, addressInfo);
        }
    }

    const handleDefault = async () => {
        if (user != null) {
            if(defaultAddress != null){
                await editAddress(user.uid, defaultAddress, { ...defaultAddress, isDefault: false });
            }
           
            await editAddress(user.uid, addressInfo, { ...addressInfo, isDefault: true });
            navigate(0);
        }
    }

    return (
        <div className="rounded-lg border-2 border-black bg-card text-card-foreground shadow-sm w-full max-w-sm p-5 flex flex-col justify-evenly">
            {addressInfo.isDefault && <p className="text-sm font-bold py-2">Default</p>}
            <p className="text-xl font-bold pb-2">{addressInfo.fullname}</p>
            <div className="space-y-1">
                <p className="text-sm">
                    {addressInfo.addressLine1}
                    <br />
                    {addressInfo.addressLine2.length > 0 &&
                        (
                            <>
                                {addressInfo.addressLine2}
                                <br />
                            </>
                        )
                    }
                    {addressInfo.landmark.length > 0 &&
                        (
                            <>
                                {addressInfo.landmark}
                                <br />
                            </>
                        )
                    }
                    {addressInfo.city},{addressInfo.state} - {addressInfo.pincode}
                    <br />
                    {addressInfo.country}
                    <br />
                    Phone Number: {addressInfo.mobileNumber}
                </p>
            </div>
            <div className="flex justify-between pt-2">
                <button onClick={handleEdit} className="w-1/2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-md p-2 text-center mr-2">Edit</button>
                <button onClick={handleDelete} className="w-1/2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-md p-2 text-center">Remove</button>
            </div>
            <div className="pt-2">
                {!addressInfo.isDefault && <button onClick={handleDefault} className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-md p-2 text-center mr-2">Make Default</button>}
            </div>
        </div>
    );
}

export default AddressCard;