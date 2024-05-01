import { useState } from "react";

interface ProductSortProps<T> {
    products: T[];
    setProducts: React.Dispatch<React.SetStateAction<T[]>> | ((products: T[]) => void);
}

const sortBy = <T extends { price: number }>({ products, setProducts }: ProductSortProps<T>) => {
    const [isSortDropdownDisplay, setSortDropdownDisplay] = useState(false);
    const sortByPrice = (ascending: boolean) => {
        const sortedProducts = [...products].sort((a, b) => {
            if (ascending) {
                return a.price - b.price; // Ascending order
            } else {
                return b.price - a.price; // Descending order
            }
        });
        setProducts(sortedProducts);
        setSortDropdownDisplay(!isSortDropdownDisplay);
    };

    return (<div className="flex flex-col flex-nowrap items-end gap-1 fixed z-[40] right-4 top-[6.5rem] bg-[#fdd35b] w-full py-1">
        <button
            id="sortBy"
            onClick={() => { setSortDropdownDisplay(!isSortDropdownDisplay) }}
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center" type="button">Sort By {
                isSortDropdownDisplay ?
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-2.8 ms-3" viewBox="0 0 512 512" fill="currentColor"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-2.8 ms-3" viewBox="0 0 512 512" fill="currentColor"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
            }
        </button>
        <div id="dropdown" className={`${isSortDropdownDisplay ? '' : 'hidden'} z-10 divide-y divide-gray-100 rounded-lg shadow min-w-min max-w-xs absolute top-[3rem] bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-md`}>
            <ul className="py-2 text-sm text-white " aria-labelledby="dropdownDefaultButton">
                <li id="sortLowToHigh" onClick={() => sortByPrice(true)} className="block px-4 py-2 hover:bg-gray-100 ">
                    Price (Low to High)
                </li>
                <li id="sortHighToLow" onClick={() => sortByPrice(false)}>
                    <p className="block px-4 py-2 hover:bg-gray-100 ">Price (High to Low)</p>
                </li>
            </ul>
        </div>
    </div>);
}

export default sortBy;