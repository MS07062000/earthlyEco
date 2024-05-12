import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/apphook";
import { logout } from "../../store/actions/authActions";
import { Button, Icon } from "..";
interface DropdownMenuItemProps {
  id: string;
  to: string;
  text: string;
  iconName: string;
  iconColor: string;
}

const Navbar: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const onLogout = () => {
    dispatch(logout(false));
  };

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
                <img
                  src="/logo.png"
                  className="h-12  mr-3"
                  alt="Earthly Eco Shop Logo"
                />
                <span className="self-center text-2xl font-semibold whitespace-nowrap ">
                  Earthly Eco
                </span>
              </a>
            </div>
            <div className="flex items-center lg:order-2">
              <Link to="/ordersAndRefunds">
                <Button
                  id="ordersAndRefunds"
                  text="Orders & Refunds"
                  buttonClass="hidden md:inline-block text-sm p-2 mr-2"
                  isTextVisible={true}
                />
              </Link>
              <Link to="/wishlist">
                <Button
                  id="wishlist"
                  text="Wishlist"
                  icon={<Icon type="wishlist" iconClass="w-5 h-5" />}
                  buttonClass="hidden md:inline-block text-sm p-2 mr-2"
                  isTextVisible={false}
                />
              </Link>
              <Link to="/cart">
                <Button
                  id="cart"
                  text="My Cart"
                  icon={<Icon type="cart" iconClass="w-5 h-5" />}
                  buttonClass="hidden md:inline-block text-sm p-2 mr-2"
                  isTextVisible={false}
                />
              </Link>
              <button
                id="user-menu-button"
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 "
                aria-expanded="false"
                onClick={handleDropdownToggle}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="user photo"
                />
              </button>
            </div>
          </div>
        </nav>

        {isDropdownOpen && (
          <div
            className="-mt-1.5 absolute right-2 z-50 w-56 text-base list-none bg-gradient-to-t from-blue-500 via-blue-600 to-blue-700 rounded divide-y divide-gray-100 shadow "
            id="dropdown"
          >
            {auth.user !== null && (
              <div className="py-3 px-4">
                {auth.user.name !== auth.user.email && (
                  <span className="block text-sm font-semibold text-white ">
                    {auth.user.name}
                  </span>
                )}
                <span className="block text-sm text-white font-bold truncate ">
                  {auth.user.email}
                </span>
              </div>
            )}
            <ul className="py-1 md:py-0 text-white " aria-labelledby="dropdown">
              <DropdownMenuItem
                id="md-wishlist"
                to="/wishlist"
                text="My WishList"
                iconName="wishlist"
                iconColor="text-red-500"
              />
              <DropdownMenuItem
                id="md-cart"
                to="/cart"
                text="My Cart"
                iconName="cart"
                iconColor="text-white"
              />
              <Link to="/addresses" className="flex items-center py-2 px-4">
                <Icon type="address" iconClass={`w-6 h-6 text-white mr-2`} />
                My Addresses
              </Link>
            </ul>
            <Link
              id="md-ordersAndRefunds"
              to="/ordersAndRefunds"
              className="md:hidden"
            >
              <p className="block py-2 px-4 text-white hover:bg-gray-100 ">
                Orders & Refunds
              </p>
            </Link>

            {auth.user !== null ? (
              <button
                id="signout"
                onClick={() => {
                  onLogout();
                }}
                className="w-full block py-2 md:py-0 md:pb-2 px-4 text-white text-left"
              >
                Sign out
              </button>
            ) : (
              <Link
                id="md-signin"
                to="/signIn"
                className="flex items-center py-2 px-4 text-white"
              >
                Sign in
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  id,
  to,
  text,
  iconName,
  iconColor,
}) => (
  <li>
    <Link id={id} to={to} className="md:hidden flex items-center py-2 px-4">
      <Icon type={iconName} iconClass={`w-6 h-6 ${iconColor} mr-2`} />
      {text}
    </Link>
  </li>
);
