import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { LogOut, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/apphook";
import { UserInfo } from "@/store/interfaces";
import { logout } from "@/store/actions/authActions";

const UserButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(
    (state: { auth: { user: UserInfo | null } }) => state.auth.user
  );
  const onLogout = () => {
    localStorage.clear();
    dispatch(logout(false));
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="user profile trigger">
        <Avatar aria-label="user avatar">
          <AvatarImage alt="user-button" src={"VC"} />
          <AvatarFallback className="bg-primary">
            <User className="text-black" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;