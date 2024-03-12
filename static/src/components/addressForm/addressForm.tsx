import { useState } from "react";
import { addNewAddress, editUserAddress } from "../../store/api";
import { Button, MessageModal } from "..";
import { useNavigate } from "react-router-dom";
import { Address } from "../../store/interfaces";
import { useAppSelector } from "../../store/hooks";
import Select from "./AddressFormSelect";
import Input from "./AddressFormInput";

const AddressForm = ({ isAdd, editAddressInfo }: { isAdd: boolean, editAddressInfo?: Address }) => {
    const navigate = useNavigate();
    const initialAddress: Address = isAdd ? {
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
    const auth = useAppSelector((state) => state.auth);
    const [addressCard, setAddressCard] = useState<Address>(initialAddress);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { landmark, addressLine2, ...addressCardfieldsRequired } = addressCard;

        const isEmpty = Object.values(addressCardfieldsRequired).every(value => value === '');

        if (isEmpty) {
            setErrorMessage('Please fill in all fields');
        } else {
            setErrorMessage(null);
            if (auth.user != null) {
                if (isAdd) {
                    await addNewAddress(auth.user.uid, addressCard);
                    setSuccessMessage('Address added successfully');

                } else {
                    await editUserAddress(auth.user.uid, initialAddress, addressCard);
                    setSuccessMessage('Address edited successfully');
                }
            }
        }

    };

    const postProcessingFunction = () => {
        navigate('/addresses', { replace: true });
    }

    const handleChange = <K extends keyof Address>(
        key: K,
        value: Address[K]
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
                            <Input id="full-name"
                                value={addressCard.fullname}
                                onChange={(e) => handleChange('fullname', e.target.value)}
                                label={"Full Name"}
                                required={true} />
                            <Input id="mobile-number"
                                type="tel"
                                value={addressCard.mobileNumber}
                                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                                label={"Mobile Number"}
                                required={true} />
                        </div>
                        {[{ id: 'flat-house', label: 'Flat, House No., Building, Company, Apartment', value: addressCard.addressLine1, onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange('addressLine1', e.target.value), required: true },
                        { id: 'area-street', label: 'Area, Street, Sector, Village', value: addressCard.addressLine2, onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange('addressLine2', e.target.value), required: false },
                        { id: 'landmark', label: 'Landmark', value: addressCard.landmark, onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange('landmark', e.target.value), required: false },]
                            .map(({ id, label, value, onChange, required }) => (<Input
                                id={id}
                                label={label}
                                value={value}
                                onChange={onChange}
                                required={required}
                            />))}
                        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                            <Input id="pincode"
                                value={addressCard.pincode}
                                onChange={(e) => handleChange('fullname', e.target.value)}
                                label={"Pincode"}
                                pattern="[0-9]{6}"
                                required={true} />
                            <Input id="town-city"
                                label={"Town/City"}
                                value={addressCard.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                required={true}
                            />
                        </div>
                        <Select
                            id="states"
                            label="State"
                            value={addressCard.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            options={['MP', 'UP', 'Telangana', 'Maharashtra', 'Kerala']}
                            required={true}
                        />
                        <Select
                            id="countries"
                            label="Country"
                            value={addressCard.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                            options={['United States', 'Canada', 'France', 'Germany', 'India']}
                            required={true}
                        />
                        <Button type="submit" text={isAdd ? "Add Address" : "Save Address"} isTextVisible={true} buttonClass="w-full text-sm px-5 py-2.5" />
                        {
                            successMessage != null && <MessageModal isSuccess={true} message={successMessage} setMessage={setSuccessMessage} postProcessingFunction={postProcessingFunction} />
                        }
                        {
                            errorMessage != null && <MessageModal isSuccess={false} message={errorMessage} setMessage={setErrorMessage} />
                        }

                    </div>
                </div>
            </form>
        </div>

    );
}
export default AddressForm;