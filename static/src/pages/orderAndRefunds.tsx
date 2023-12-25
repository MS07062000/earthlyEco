import { AuthContextProvider } from "../context/AuthContext"
import Navbar from '../components/Navbar/navbar';
import Products from "../components/products/products";

const OrderAndRefundPage = () => {
  return (
    <AuthContextProvider>
      <Navbar />
      <Products />
    </AuthContextProvider>
  )
}

export default OrderAndRefundPage;