import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import ThemeProvider from "./components/providers/ThemeProvider";
import AuthLayout from "./components/auth/template/AuthLayout";
import LoginPage from "./components/auth/pages/LoginPage";
// import SignupPage from "./components/auth/SignupPage";
import CategoryPage from "./components/category/pages/CategoryPage";
import ProductsPage from "./components/products/pages/ProductPage";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./hooks/apphook";
import { logout } from "./store/actions/authActions";
import Layout from "@/components/Layout";
// import { Home } from "./components/Home";

function App() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.sessionError) {
      dispatch(logout(true));
    }
  }, [auth.sessionError]);

  useEffect(() => {
    if (!auth.user) {
      navigate("/signin", { replace: true });
    }
  }, [auth.user]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route element={<Layout />}>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category" element={<CategoryPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/products" />} />
          {/* <Route path="/signup" element={<SignupPage />} /> */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
