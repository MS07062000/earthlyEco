import { useNavigate } from "react-router-dom";
import { changeDefaultAddress, deleteAddress, editAddress } from "../../store/actions/addressActions";
import { Address } from "../../store/interfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Button, Icon } from "..";

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
           dispatch(deleteAddress(addressInfo));
        }
    }

    const handleDefault = async () => {
        if (auth.user != null) {
            dispatch(changeDefaultAddress(defaultAddress, addressInfo));
        }
    }

    return (
        <div className="rounded-lg border-2 border-black bg-card text-card-foreground shadow-sm w-full max-w-[250px] p-2 flex flex-col justify-evenly">
            {addressInfo.isDefault && <p className="text-sm font-bold">Default</p>}
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
                    <div className="flex jusify-start pt-2">
                        <Button id="editAddress" text="Edit Address" isTextVisible={false} icon={<Icon type="edit" />} onClick={handleEdit} buttonClass="text-md p-2 mr-2" />
                        <Button id="deleteAddress" text="Delete Address" isTextVisible={false} icon={<Icon type="delete" />} onClick={handleDelete} buttonClass="text-md p-2" />
                    </div>
                    <div className="pt-2">
                        {!addressInfo.isDefault && <Button id="makeDefault" text="Make Default" isTextVisible={true} onClick={handleDefault} buttonClass="w-full text-md p-2" />}
                    </div>
                </>
            }
        </div>
    );
}

export default AddressCard;