import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAddress } from "../../store/actions/addressActions";
import { AddressCard, Button, Message, Spinner } from "..";
import { Address as address } from "../../store/interfaces";

const Address = () => {
    const { auth, address } = useAppSelector(state => state);
    const dispatch=useAppDispatch();
    useEffect(() => {
        if (auth.user != null) {
            dispatch(fetchAddress(auth.user.uid));
        }
    }, [auth.user]);


    return (
        <div className="p-4 mt-14 min-h-screen">
            <p className="pb-4 px-2 text-2xl capitalize font-medium text-center fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">My Addresses</p>
            {address.loading ?
                <Spinner />
                :
                <div className="bg-[#fdd35b] mt-[2rem] mb-[3.5rem] min-h-screen">
                    <div className="w-full flex flex-row flex-wrap justify-start items-stretch gap-4 p-2">
                        {
                            address.addresses.map((addressInfo: address, index: number) =>
                                <AddressCard key={index} addressInfo={addressInfo} defaultAddress={address.defaultAddress} showButtons={true} />
                            )
                        }
                    </div>
                    <div className="fixed bottom-0 right-0 z-50 bg-[#fdd35b] p-2">
                        <Link to="/addAddress">
                            <Button text="Add Address" isTextVisible={true} buttonClass="text-md p-2" />
                        </Link>
                    </div>
                    {
                        address.error != null && <Message type="error" message={address.error} />
                    }
                </div>
            }
        </div>

    );
}

export default Address;