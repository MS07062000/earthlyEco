import { Link } from "react-router-dom";
import { AddressCard, Button, Message, Spinner } from "..";
import { Address as address } from "../../store/interfaces";
import useAddress from "../../store/hooks/addresshook";

const Address: React.FC = () => {
  const { address } = useAddress();

  return (
    <div className="p-4 mt-14 min-h-screen">
      <p className="pb-4 px-2 text-2xl capitalize font-medium text-center fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">
        My Addresses
      </p>
      {address.loading ? (
        <Spinner />
      ) : (
        <div className="bg-[#fdd35b] my-[3.5rem] min-h-screen">
          <div className="w-full flex flex-row flex-wrap justify-start items-stretch gap-8 p-2">
            {address.addresses && address.addresses.map((addressInfo: address, index: number) => (
              <AddressCard
                key={index}
                addressInfo={addressInfo}
                defaultAddress={address.defaultAddress}
                showButtons={true}
              />
            ))}
          </div>
          <div className="fixed bottom-0 right-0 z-50 bg-[#fdd35b] p-2">
            <Link to="/addAddress">
              <Button
                id="addAddress"
                text="Add Address"
                isTextVisible={true}
                buttonClass="text-md p-2"
              />
            </Link>
          </div>
          {address.error != null && (
            <Message type="error" message={address.error} />
          )}
        </div>
      )}
    </div>
  );
};

export default Address;
