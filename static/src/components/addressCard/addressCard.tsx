import { useNavigate } from "react-router-dom";
import { Address } from "../../store/interfaces";
import { Button, Icon } from "..";
import useAddressHook from "../../store/hooks/addresshook";

interface AddressCardProps {
  addressInfo: Address;
  showButtons: boolean;
  className?: string;
}

const AddressCard: React.FC<AddressCardProps> = ({
  addressInfo,
  showButtons,
  className,
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
    if (addressInfo.id) {
      changeDefaultAddress(addressInfo.id);
    }
  };

  return (
    <div
      className={`rounded-lg w-full max-w-[250px] p-2 flex flex-col justify-evenly ${className}`}
    >
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
