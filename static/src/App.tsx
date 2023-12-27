import './App.css';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import ForgetPassword from './pages/forgetPassword';
import Home from './pages/home';
import Product from './pages/product';
import {
  Routes,
  Route
} from 'react-router-dom';
import ShoppingCart from './pages/shoppingCart';
import Wishlist from './pages/wishlist';
import OrdersAndRefunds from './pages/ordersAndRefunds';

export default function App() {
  return (
    <Routes>
      <Route path="/signUp" element={<SignUp/>} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path='/' element={<Home/>}/>
      <Route path='/products' element={<Product/>}/>
      <Route path='/wishlist' element={<Wishlist/>}/>
      <Route path='/cart' element={<ShoppingCart/>}/>
      <Route path='/ordersAndRefunds' element={<OrdersAndRefunds/>}/>
    </Routes>
  )
}