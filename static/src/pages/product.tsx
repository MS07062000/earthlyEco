import { AuthContextProvider } from "../context/AuthContext"
import Navbar from '../components/Navbar/navbar';
import Products from "../components/products/products";

const ProductPage = () => {
  return (
    <AuthContextProvider>
      <Navbar />
      <Products />
    </AuthContextProvider>
  )
}

export default ProductPage;