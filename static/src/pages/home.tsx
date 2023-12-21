import { AuthContextProvider } from "../context/AuthContext"
import Navbar from '../components/Navbar/navbar';
import Category from "../components/category/category";

const HomePage = () => {
  return (
    <AuthContextProvider>
      <Navbar />
      <Category />
    </AuthContextProvider>
  )
}

export default HomePage;