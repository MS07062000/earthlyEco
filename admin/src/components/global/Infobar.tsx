import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/auth/atoms/UserButton";
import { useAppSelector } from "@/hooks/apphook";
import ThemeToggle from "./ThemeToggle";

const InfoBar: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="flex flex-row justify-end gap-6 items-center px-4 py-4 w-full bg-[#fdd35b] dark:bg-black ">
      {user === null && (
        <Button asChild>
          <Link to={"/signin"}>Login</Link>
        </Button>
      )}
      <ThemeToggle />
      <UserButton />
    </div>
  );
};

export default InfoBar;