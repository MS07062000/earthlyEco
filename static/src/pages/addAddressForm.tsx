import { Navbar, AddressForm } from "../components"

const AddAddressFormPage = () => {
  return (
    <>
      <Navbar />
      <AddressForm isAdd={true} />
    </>
  )
}

export default AddAddressFormPage;