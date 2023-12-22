interface SuccessModalProps {
    successMessage: string;
    setSuccessMessage:React.Dispatch<React.SetStateAction<string | null>>;
}

const SuccessModal = ({ successMessage,setSuccessMessage }: SuccessModalProps) => {
    const closeModal=()=>{
        setSuccessMessage(null);
    }
    return (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center mx-1">
            <div className="mt-14 relative p-4 w-full max-w-xs max-h-full">
                <div className="relative bg-black rounded-lg shadow">
                    <button onClick={()=>{closeModal()}} type="button" className="absolute top-3 end-2.5  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 md:p-5 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" className="m-auto">
                            <path fill="#C8E6C9" d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"></path><polyline fill="none" stroke="#4CAF50" strokeMiterlimit="10" strokeWidth="4" points="14,24 21,31 36,16"></polyline>
                        </svg>
                        <h3 className="mb-2 text-lg font-normal text-white">{
                            successMessage
                        }</h3>
                        <button type="button" onClick={()=>{closeModal()}} className="p-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-md text-center">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuccessModal;