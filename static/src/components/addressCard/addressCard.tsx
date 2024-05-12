import { useNavigate } from "react-router-dom";
import { Address } from "../../store/interfaces";
import { Button, Icon } from "..";
import useAddressHook from "../../store/hooks/addresshook";

interface AddressCardProps {
  addressInfo: Address;
  defaultAddress: Address | null;
  showButtons: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  addressInfo,
  defaultAddress,
  showButtons,
}) => {
  const navigate = useNavigate();
  const { deleteAddress, changeDefaultAddress } = useAddressHook();
  const handleEdit = () => {
    navigate("/editAddress", { state: { address: addressInfo } });
  };

  const handleDelete = async () => {
    deleteAddress(addressInfo);
  };

  const handleDefault = async () => {
    changeDefaultAddress(defaultAddress, addressInfo);
  };

  return (
    <div className="rounded-lg shadow-[-10px_10px_20px_#d7b34d,10px_-10px_20px_#fff369] bg-card text-card-foreground w-full max-w-[250px] p-2 flex flex-col justify-evenly">
      {addressInfo.isDefault && <p className="text-sm font-bold">Default</p>}
      <p className="text-xl font-bold pb-2">{addressInfo.fullname}</p>
      <div className="space-y-1">
        <p className="text-sm">
          {addressInfo.addressLine1}
          <br />
          {addressInfo.addressLine2.length > 0 && (
            <>
              {addressInfo.addressLine2}
              <br />
            </>
          )}
          {addressInfo.landmark.length > 0 && (
            <>
              {addressInfo.landmark}
              <br />
            </>
          )}
          {addressInfo.city},{addressInfo.state} - {addressInfo.pincode}
          <br />
          {addressInfo.country}
          <br />
          Phone Number: {addressInfo.mobileNumber}
        </p>
      </div>
      {showButtons && (
        <>
          <div className="flex jusify-start pt-2">
            <Button
              id="editAddress"
              text="Edit Address"
              isTextVisible={false}
              icon={<Icon type="edit" />}
              onClick={handleEdit}
              buttonClass="text-md p-2 mr-2"
            />
            <Button
              id="deleteAddress"
              text="Delete Address"
              isTextVisible={false}
              icon={<Icon type="delete" />}
              onClick={handleDelete}
              buttonClass="text-md p-2"
            />
          </div>
          <div className="pt-2">
            {!addressInfo.isDefault && (
              <Button
                id="makeDefault"
                text="Make Default"
                isTextVisible={true}
                onClick={handleDefault}
                buttonClass="w-full text-md p-2"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AddressCard;
