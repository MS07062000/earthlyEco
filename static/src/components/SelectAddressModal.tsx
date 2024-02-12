import address from "../store/interfaces/address";
import AddressCard from "./addressCard/AddressCard";

const SelectAddressModal = (
    { listOfAddressInfo, selectAddress, setSelectAddress, setShowSelectAddressModal, handleProceedToCheckOut }: { listOfAddressInfo: address[], selectAddress: address | null, setSelectAddress: React.Dispatch<React.SetStateAction<address | null>>, setShowSelectAddressModal: React.Dispatch<React.SetStateAction<boolean>>, handleProceedToCheckOut: () => void }) => {
    const closeModal = () => {
        setShowSelectAddressModal(false);
    }
    const handleNext = () => {
        handleProceedToCheckOut();
        closeModal();
    }
    return (
        <div id="select-modal" tabIndex={-1} aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-screen md:inset-0 h-screen text-white">
            <div className="mt-14 relative p-4 w-full max-w-md max-h-full">
                <div className="relative  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg shadow ">
                    <div className="flex items-center justify-between py-2 px-4  border-b rounded-t ">
                        <h3 className="text-lg font-semibold">
                            Select Delivery Address
                        </h3>
                        <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 overflow-y-scroll h-64">
                        <ul className="space-y-4 mb-4">
                            {
                                listOfAddressInfo.map((addressInfo: address, index: number) =>
                                    <li key={index}>
                                        <input type="radio" id={`address_${index}`} name="address" value={index} checked={selectAddress === addressInfo} onChange={() => setSelectAddress(addressInfo)} className="accent-[#FDD35B]" />
                                        <AddressCard addressInfo={addressInfo} defaultAddress={listOfAddressInfo[0]} showButtons={false} />
                                    </li>
                                )
                            }
                        </ul>

                    </div>
                    {selectAddress != null &&
                        <div className="px-4 py-2">
                            <button onClick={handleNext} className="text-black inline-flex w-full justify-center bg-[#FDD35B]  focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Next
                            </button>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}

export default SelectAddressModal;