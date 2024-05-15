import { Routes, Route } from "react-router-dom";
import "./App.css";
import { SignIn } from "./pages/signIn";
import { ThemeProvider } from "@/components/theme-provider";
import { Dashboard } from "./pages/dashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
