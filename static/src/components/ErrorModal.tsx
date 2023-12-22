interface ErrorModalProps {
    errorMessage: string;
    setErrorMessage:React.Dispatch<React.SetStateAction<string | null>>;
}

const ErrorModal = ({ errorMessage,setErrorMessage }: ErrorModalProps) => {
    const closeModal=()=>{
        setErrorMessage(null);
    }
    return (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center mx-1">
            <div className="mt-14 relative p-4 w-full max-w-xs max-h-full">
                <div className="relative bg-black rounded-lg shadow">
                    <button type="button" className="absolute top-3 end-2.5  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 md:p-5 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" className="m-auto">
                            <path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                        </svg>
                        <h3 className="mb-2 text-lg font-normal text-white">{
                            errorMessage
                        }</h3>
                        <button type="button" className="p-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-md text-center">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorModal;