import Button from "./Button";
import Icon from "./Icon";

interface MessageModalProps {
    isSuccess: boolean;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string | null>> | (() => void);
    postProcessingFunction?: () => void;
}

function isVoidFunction(value: any): value is () => void {
    return typeof value === 'function';
}

const MessageModal = ({ isSuccess, message, setMessage, postProcessingFunction }: MessageModalProps) => {
    const closeModal = () => {
        if (isVoidFunction(setMessage)) {
            setMessage();
        } else {
            setMessage(null);
        }

        if (postProcessingFunction) {
            postProcessingFunction();
        }
    }
    return (
        <div id="messageModal" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center mx-1">
            <div className="mt-14 relative p-4 w-full max-w-xs max-h-full">
                <div className="relative bg-black rounded-lg shadow">
                    <Button id="closeButton" icon={<Icon type="close" iconClass="w-3 h-3" />} onClick={closeModal} buttonClass="absolute top-3 end-2.5 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center font-medium" isTextVisible={false} text={"close"} />
                    <div className="p-4 md:p-5 text-center">
                        {isSuccess ? <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" className="m-auto">
                            <path fill="#C8E6C9" d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"></path>
                            <polyline fill="none" stroke="#4CAF50" strokeMiterlimit="10" strokeWidth="4" points="14,24 21,31 36,16">
                            </polyline>
                        </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" className="m-auto">
                                <path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                            </svg>}
                        <h3 className="mb-2 text-lg font-normal text-white">{
                            message
                        }</h3>
                        <Button id="closeButton" text="Close" buttonClass="p-2 text-md" isTextVisible={true} onClick={closeModal} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageModal;