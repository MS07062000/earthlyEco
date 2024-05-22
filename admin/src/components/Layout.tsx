import { Outlet } from "react-router-dom";
import InfoBar from "@/components/global/Infobar";
import Sidebar from "@/components/global/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen max-h-max">
      <Sidebar />
      <div className="w-full ">
        <InfoBar />
        <Outlet />
      </div>
      <Toaster richColors closeButton />
    </div>
  );
};

export default Layout;
