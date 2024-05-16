export default interface Address {
  id?: string;
  fullname: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}
