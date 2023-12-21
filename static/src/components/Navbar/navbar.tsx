import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen); // Toggles dropdown visibility
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

                            <form action="#" method="GET" className="hidden lg:block lg:pl-2">
                                <label htmlFor="topbar-search" className="sr-only">Search</label>
                                <div className="relative mt-1 lg:w-96">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"> <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" /> </svg>
                                    </div>
                                    <input type="text" name="email" id="topbar-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-9 p-2.5" placeholder="Search" />
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center lg:order-2">
                            <button id="toggleSidebarMobileSearch" type="button" className="hidden text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm p-2 text-center mr-2">
                                <span className="sr-only">Search</span>
                                {/* Search icon */}
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </button>
                            {/* Wishlist */}
                            <Link to="/wishlist">
                                <button type="button" className="hidden md:inline-block text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm p-2 text-center mr-2">
                                    <span className="sr-only">Wishlist</span>
                                    {/* Wishlist Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" fill="currentColor"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>
                                </button>
                            </Link>

                            {/* Cart  */}
                            <Link to="/cart">
                                <button type="button" className="hidden md:inline-block text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm p-2 text-center mr-2">
                                    <span className="sr-only">My Cart</span>
                                    {/* Cart Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512" fill="currentColor"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                                </button>
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
                    <div className="-mt-1.5 absolute right-2 z-50 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow " id="dropdown">
                        <div className="py-3 px-4">
                            <span className="block text-sm font-semibold text-gray-900 ">Neil sims</span>
                            <span className="block text-sm text-gray-500 truncate ">name@flowbite.com</span>
                        </div>

                        <ul className="md:hidden py-1 text-gray-500 " aria-labelledby="dropdown">
                            <li>
                                <Link to="/wishlist" className=" flex items-center py-2 px-4 text-sm hover:bg-gray-100  ">
                                    <svg className="w-6 h-6 text-gray-800  mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                                    </svg>
                                    My WishList
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 ">
                                    <svg className="w-6 h-6 text-gray-800  mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1" />
                                    </svg>
                                    My Cart
                                </Link>
                            </li>
                        </ul>
                        <ul className="py-1 text-gray-500" aria-labelledby="dropdown">
                            <li>
                                <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 ">Sign out</a>
                            </li>
                        </ul>
                    </div>
                }
            </header>
        </>
    );
}

export default Navbar;