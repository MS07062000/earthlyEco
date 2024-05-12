import "./App.css";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import ForgetPassword from "./pages/forgetPassword";
import Home from "./pages/home";
import Product from "./pages/product";
import { Routes, Route } from "react-router-dom";
import ShoppingCart from "./pages/shoppingCart";
import Wishlist from "./pages/wishlist";
import OrdersAndRefunds from "./pages/ordersAndRefunds";
import Address from "./pages/address";
import EditAddress from "./pages/editAddressForm";
import AddAddress from "./pages/addAddressForm";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks/apphook";
import { logout } from "./store/actions/authActions";

export default function App() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (auth.sessionError) {
      dispatch(logout(true));
    }
  }, [auth.sessionError]);

  return (
    <Routes>
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Product />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/ordersAndRefunds" element={<OrdersAndRefunds />} />
      <Route path="/addAddress" element={<AddAddress />} />
      <Route path="/editAddress" element={<EditAddress />} />
      <Route path="/addresses" element={<Address />} />
    </Routes>
  );
}
