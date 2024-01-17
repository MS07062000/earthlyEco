import { useState, MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../../context/AuthContext";
interface DropdownMenuItemProps {
    to: string;
    text: string;
    iconName: string;
    iconColor: string;
}

interface IconProps {
    type: string;
    iconClass?: string;
}

interface IconButtonProps {
    text: string; icon?: ReactNode;
}

const Navbar:React.FC = () => {
    const { user, authFunctions } = useUserAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const onLogout = (() => {
        try {
            authFunctions?.logOut();
        } catch (error) {
            console.log("Logout");
        }
    });

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <header className="antialiased fixed z-[99] top-0 w-full ">
                <nav className=" border-gray-200 px-4 lg:px-6 py-2.5 bg-[#fdd35b]">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="flex justify-start items-center">
                            <a href="/" className="flex mr-4">
                                <img src="/logo.png" className="h-12  mr-3" alt="Earthly Eco Shop Logo" />
                                <span className="self-center text-2xl font-semibold whitespace-nowrap ">Earthly Eco</span>
                            </a>
                        </div>
                        <div className="flex items-center lg:order-2">
                            <Link to="/ordersAndRefunds">
                                <IconButton text="Orders & Refunds" />
                            </Link>
                            <Link to="/wishlist">
                                <IconButton text="Wishlist" icon={<Icon type="wishlist" />} />
                            </Link>
                            <Link to="/cart">
                                <IconButton text="My Cart" icon={<Icon type="cart" />} />
                            </Link>
                            {/* User profile With Dropdown */}
                            <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 " id="user-menu-button" aria-expanded="false" onClick={handleDropdownToggle}>
                                <span className="sr-only">Open user menu</span>
                                <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                            </button>


                        </div>
                    </div>
                </nav>

                {/* Dropdown menu for user profile */}
                {isDropdownOpen &&
                    <div className="-mt-1.5 absolute right-2 z-50 w-56 text-base list-none bg-gradient-to-t from-blue-500 via-blue-600 to-blue-700 rounded divide-y divide-gray-100 shadow " id="dropdown">
                        <div className="py-3 px-4">
                            {
                                user?.name !== user?.email && <span className="block text-sm font-semibold text-white ">{user?.name}</span>
                            }
                            <span className="block text-sm text-white font-bold truncate ">{user?.email}</span>
                        </div>

                        <ul className="py-1 text-white " aria-labelledby="dropdown">
                            <DropdownMenuItem to="/wishlist" text="My WishList" iconName="wishlist" iconColor="text-red-500" />
                            <DropdownMenuItem to="/cart" text="My Cart" iconName="cart" iconColor="text-white" />
                            <DropdownMenuItem to="/addresses" text="My Addresses" iconName="address" iconColor="text-white" />
                        </ul>
                        <ul className="py-1 text-white" aria-labelledby="dropdown">
                            <Link to="/ordersAndRefunds" className="md:hidden">
                                <li>
                                    <p className="block py-2 px-4 hover:bg-gray-100 ">Orders & Refunds</p>
                                </li>
                            </Link>
                            <li>
                                <p onClick={() => { onLogout() }} className="block py-2 px-4 hover:bg-gray-100 ">Sign out</p>
                            </li>
                        </ul>
                    </div>
                }
            </header>
        </>);
}

const IconButton:React.FC<IconButtonProps> = ({ text, icon }) => (
    <button type="button" className="hidden md:inline-block text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm p-2 text-center mr-2">
        <span className="sr-only">{text}</span>
        {icon != undefined ? icon : text}
    </button>
);

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ to, text, iconName, iconColor }) => (
    <li>
        <Link to={to} className="md:hidden flex items-center py-2 px-4 hover:bg-gray-100">
            <Icon type={iconName} iconClass={`w-6 h-6 ${iconColor} mr-2`} />
            {text}
        </Link>
    </li>
);

// Icon Component
const Icon: React.FC<IconProps> = ({ type, iconClass }) => {
    switch (type) {
        case 'wishlist':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} height="16" width="16" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                </svg>
            );
        case 'cart':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} height="16" width="18" viewBox="0 0 576 512" fill="currentColor">
                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                </svg>
            );
        case 'address':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} aria-hidden="true" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                </svg>
            );
        default:
            return null;
    }
};

export default Navbar;