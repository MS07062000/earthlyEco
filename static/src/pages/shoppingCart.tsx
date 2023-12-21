import { AuthContextProvider } from "../context/AuthContext"
import Navbar from '../components/Navbar/navbar';
import Cart from "../components/cart/cart";

const ShoppingCartPage = () => {
  return (
    <AuthContextProvider>
      <Navbar />
      <Cart />
    </AuthContextProvider>
  )
}

export default ShoppingCartPage;