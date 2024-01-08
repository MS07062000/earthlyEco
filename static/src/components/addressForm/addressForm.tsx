import { useState } from "react";
import { addressCard } from "../address/address";
import { addNewAddress } from "./helpers/addNewAddress";
import { editAddress } from "./helpers/editAddress";
import ErrorModal from "../ErrorModal";
import { useUserAuth } from "../../context/AuthContext";
import SuccessModal from "../SuccessModal";
import { useNavigate } from "react-router-dom";

const AddressForm = ({ isAdd, editAddressInfo }: { isAdd: boolean, editAddressInfo?: addressCard }) => {
    const navigate = useNavigate();
    const initialAddress: addressCard = isAdd ? {
        fullname: '',
        mobileNumber: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        pincode: '',
        city: '',
        state: 'Telangana',
        country: 'India',
        isDefault: false
    } : editAddressInfo || {
        fullname: '',
        mobileNumber: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        pincode: '',
        city: '',
        state: 'Telangana',
        country: 'India',
        isDefault: false
    };
    const { user } = useUserAuth();
    const [addressCard, setAddressCard] = useState<addressCard>(initialAddress);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    // const [fullname, setFullName] = useState<string | undefined>(isAdd ? '' : editAddress?.fullname);
    // const [mobileNumber, setMobileNumber] = useState<string | undefined>(isAdd ? '' : editAddress?.mobileNumber);
    // const [addressLine1, setAddressLine1] = useState<string | undefined>(isAdd ? '' : editAddress?.addressLine1);
    // const [addressLine2, setAddressLine2] = useState<string | undefined>(isAdd ? '' : editAddress?.addressLine2);
    // const [landmark, setLandmark] = useState<string | undefined>(isAdd ? '' : editAddress?.landmark);
    // const [pincode, setPincode] = useState<string | undefined>(isAdd ? '' : editAddress?.pincode);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { landmark, addressLine2, ...addressCardfieldsRequired } = addressCard;

        const isEmpty = Object.values(addressCardfieldsRequired).every(value => value === '');

        if (isEmpty) {
            setErrorMessage('Please fill in all fields');
        } else {
            setErrorMessage(null);
            if (user != null) {
                if (isAdd) {
                    await addNewAddress(user.uid, addressCard);
                    setSuccessMessage('Address added successfully');

                } else {
                    await editAddress(user.uid, initialAddress, addressCard);
                    setSuccessMessage('Address edited successfully');
                }
            }
        }

    };

    const postProcessingFunction = () => {
        navigate('/addresses', { replace: true });
    }

    const handleChange = <K extends keyof addressCard>(
        key: K,
        value: addressCard[K]
    ) => {
        setAddressCard(prevAddressCard => ({
            ...prevAddressCard,
            [key]: value,
        }));
    };

    return (
        <div className="mt-16 mx-auto max-w-md space-y-6 min-h-screen">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">{isAdd ? "Add New" : "Edit"} Address</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="rounded-lg md:border-solid md:border-2 md:border-black  bg-card text-card-foreground shadow-sm" data-v0-t="card">
                    <div className="p-2 md:p-6 space-y-4">
                        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black" htmlFor="full-name">Full Name</label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                    id="full-name"
                                    placeholder="Enter your full name"
                                    value={addressCard.fullname}
                                    onChange={(e) => handleChange('fullname', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black" htmlFor="mobile-number">Mobile Number</label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                    id="mobile-number"
                                    placeholder="Enter your mobile number"
                                    value={addressCard.mobileNumber}
                                    onChange={(e) => handleChange('mobileNumber', e.target.value)}
                                    required
                                    type="tel"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black" htmlFor="flat-house">Flat, House No., Building, Company, Apartment</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                id="flat-house"
                                placeholder="Enter your flat, house no., building, company, apartment"
                                value={addressCard.addressLine1}
                                onChange={(e) => handleChange('addressLine1', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black" htmlFor="area-street">Area, Street, Sector, Village</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                id="area-street"
                                placeholder="Enter your area, street, sector, village"
                                value={addressCard.addressLine2}
                                onChange={(e) => handleChange('addressLine2', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black" htmlFor="landmark">Landmark</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                id="landmark"
                                placeholder="E.g. near Apollo Hospital"
                                value={addressCard.landmark}
                                onChange={(e) => handleChange('landmark', e.target.value)}
                            />
                        </div>
                        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black" htmlFor="pincode">Pincode</label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                    id="pincode"
                                    pattern="[0-9]{6}"
                                    placeholder="Enter your pincode"
                                    value={addressCard.pincode}
                                    onChange={(e) => handleChange('pincode', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black" htmlFor="town-city">Town/City</label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                    id="town-city"
                                    placeholder="Enter your town/city"
                                    value={addressCard.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 ">State</label>
                        <select id="states" defaultValue={addressCard.state} onChange={(e) => handleChange('state', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"  required>
                            <option value=''>Choose a state</option>
                            <option value="MP">MP</option>
                            <option value="UP">UP</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Kerala">Kerala</option>
                        </select>
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 ">Country</label>
                        <select id="countries" defaultValue={addressCard.country} onChange={(e) => handleChange('country', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="France">France</option>
                            <option value="Germany">Germany</option>
                            <option value="India">India</option>
                        </select>
                        <button type="submit"
                            className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            {isAdd ? "Add" : "Save"} Address
                        </button>
                        {
                            successMessage != null && <SuccessModal successMessage={successMessage} setSuccessMessage={setSuccessMessage} postProcessingFunction={postProcessingFunction} />
                        }
                        {
                            errorMessage != null && <ErrorModal errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
                        }
                    </div>
                </div>
            </form>
        </div>

    );
}
export default AddressForm;