import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../../context/AuthContext";
import { getAddressesOfUser } from "./helpers/getAddressesOfUser";
import AddressCard from "../addressCard/addressCard";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";

export interface addressCard {
    fullname: string,
    mobileNumber: string,
    addressLine1: string,
    addressLine2: string,
    landmark: string,
    pincode: string,
    city: string,
    state: string,
    country: string,
    isDefault: boolean
}

const Address = () => {
    const { user } = useUserAuth();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [listOfAddressInfo, setListOfAddressInfo] = useState<addressCard[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [defaultAddress, setDefaultAddress] = useState<addressCard | null>(null);
    useEffect(() => {
        if (user != null) {
            getAddressesOfUser(user!.uid).then((data) => {
                setLoading(false);
                const defaultAddr = data.find((address: addressCard) => address.isDefault === true);
                const updatedList = data.filter((address: addressCard) => address !== defaultAddr);
                if (defaultAddr) {
                    updatedList.unshift(defaultAddr);
                }
                setListOfAddressInfo(updatedList);
                setDefaultAddress(defaultAddr || null);
            }).catch((error) => {
                setLoading(false);
                setErrorMessage("Error in getting addresses");
            });
        }
    }, [user]);


    return (
        <div className="p-4 mt-14 min-h-screen">
            <p className="pb-4 px-2 text-2xl capitalize font-medium text-center fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">My Addresses</p>
            {isLoading ?
                <Spinner />
                :
                <div className="bg-[#fdd35b] mt-[2rem] mb-[3.5rem] min-h-screen">
                    <div className="w-full flex flex-row flex-wrap justify-start items-stretch gap-4 p-2">
                        {
                            listOfAddressInfo.map((address: addressCard, index: number) =>
                                <AddressCard key={index} addressInfo={address} defaultAddress={defaultAddress} showButtons={true} />
                            )
                        }
                    </div>
                    <div className="fixed bottom-0 right-0 z-50 bg-[#fdd35b] p-2">
                        <Link to="/addAddress">
                            <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-md p-2 text-center">Add Address</button>
                        </Link>
                    </div>
                    {
                        errorMessage != null && <ErrorMessage errorMessage={errorMessage} />
                    }
                </div>
            }
        </div>

    );
}

export default Address;