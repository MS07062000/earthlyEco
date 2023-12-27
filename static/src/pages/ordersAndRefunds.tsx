import { AuthContextProvider } from "../context/AuthContext"
import Navbar from '../components/Navbar/navbar';
import OrdersAndRefunds from "../components/orderAndRefund/ordersAndRefunds";

const OrdersAndRefundsPage = () => {
  return (
    <AuthContextProvider>
      <Navbar />
      <OrdersAndRefunds />
    </AuthContextProvider>
  )
}

export default OrdersAndRefundsPage;