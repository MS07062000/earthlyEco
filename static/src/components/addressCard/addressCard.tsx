import { useNavigate } from "react-router-dom";
import { deleteAddress } from "../../store/api/deleteAddress";
import { editAddress } from "../../store/api/editAddress";
import { Address } from "../../store/interfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Button } from "..";

const AddressCard = ({ addressInfo, defaultAddress, showButtons }: { addressInfo: Address, defaultAddress: Address | null, showButtons: boolean }) => {
    const auth = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleEdit = () => {
        if (auth.user != null) {
            navigate('/editAddress', { state: { address: addressInfo } });
        }
    }

    const handleDelete = async () => {
        if (auth.user != null) {
            await deleteAddress(auth.user.uid, addressInfo);
        }
    }

    const handleDefault = async () => {
        if (auth.user != null) {
            if (defaultAddress != null) {
                await editAddress(auth.user.uid, defaultAddress, { ...defaultAddress, isDefault: false });
            }

            await editAddress(auth.user.uid, addressInfo, { ...addressInfo, isDefault: true });
            navigate(0);
        }
    }

    return (
        <div className="rounded-lg border-2 border-black bg-card text-card-foreground shadow-sm w-full max-w-sm p-2 flex flex-col justify-evenly">
            {addressInfo.isDefault && <p className="text-sm font-bold pb-2">Default</p>}
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
            {showButtons &&
                <>
                    <div className="flex justify-between pt-2">
                        <Button text="Edit Address" isTextVisible={true} onClick={handleEdit} buttonClass="w-1/2 text-md p-2 mr-2" />
                        <Button text="Delete Address" isTextVisible={true} onClick={handleDelete} buttonClass="w-1/2 text-md p-2" />
                    </div>
                    <div className="pt-2">
                        {!addressInfo.isDefault && <Button text="Make Default" isTextVisible={true} onClick={handleDefault} buttonClass="w-full text-md p-2" />}
                    </div>
                </>
            }
        </div>
    );
}

export default AddressCard;