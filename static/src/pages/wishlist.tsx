import { AuthContextProvider } from "../context/AuthContext"
import Navbar from '../components/Navbar/navbar';
import Wishlist from "../components/wishlist/wishlist";

const WishlistPage = () => {
  return (
    <AuthContextProvider>
      <Navbar />
      <Wishlist/>
    </AuthContextProvider>
  )
}

export default WishlistPage;